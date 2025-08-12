import dedent from "dedent";
import { graphql } from "gql.tada";
import { http, createPublicClient, formatEther, formatUnits } from "viem";
import { fraxtal } from "viem/chains";

import { FRAXLEND_ABI } from "../lib/fraxlend.abi.js";
import { client as gqlClient } from "../lib/graphql.js";

const SECONDS_PER_YEAR = 365 * 24 * 60 * 60;
const DEFAULT_RESERVE_FACTOR_BPS = 800; // used only if on-chain read fails

const LENDING_PAIRS_QUERY = graphql(`
  query GetLendingPairs {
    pairs(first: 100) {
      id
      name
      symbol
      address
      asset { symbol decimals address }
      collateral { symbol decimals address }
      dailyHistory(first: 1, orderBy: timestamp, orderDirection: desc) {
        interestPerSecond
        utilization
        totalAssetAmount
        totalBorrowAmount
        timestamp
      }
    }
  }
`);

const publicClient = createPublicClient({
	chain: fraxtal,
	transport: http(),
});

type Pair = {
	id: string;
	name: string;
	symbol: string;
	address: string;
	asset: { symbol: string; decimals: string | number; address: string };
	collateral: { symbol: string; decimals: string | number; address: string };
	dailyHistory: Array<{
		interestPerSecond: string;
		utilization: string;
		totalAssetAmount: string;
		totalBorrowAmount: string;
		timestamp: string;
	}>;
};

export class LendingStatsService {
	async getStats() {
		// 1) Pull pairs from subgraph
		const data = (await gqlClient.request(LENDING_PAIRS_QUERY)) as {
			pairs: Pair[];
		};
		const pairs = data.pairs ?? [];

		// 2) Read reserve factor on-chain for each pair via multicall
		const addresses = pairs.map((p) => (p.address || p.id) as `0x${string}`);
		const reserveByAddr = await this.fetchReserveFactors(addresses);

		// 3) Compute metrics
		return pairs.map((pair) => {
			const h = pair.dailyHistory?.[0];
			const decimals = Number(pair.asset.decimals);

			const totalAssets = Number(
				formatUnits(BigInt(h.totalAssetAmount), decimals),
			);
			const totalBorrows = Number(
				formatUnits(BigInt(h.totalBorrowAmount), decimals),
			);
			const utilization = totalAssets > 0 ? totalBorrows / totalAssets : 0;

			const borrowAprPct = this.borrowAprPct(h.interestPerSecond);
			const reserveFactor =
				reserveByAddr[(pair.address || pair.id).toLowerCase()] ??
				DEFAULT_RESERVE_FACTOR_BPS / 10_000;

			const lendApyPct = this.lendApyPct(
				h.interestPerSecond,
				utilization,
				reserveFactor,
			);

			return {
				address: pair.id,
				symbol: pair.symbol,
				asset: pair.asset,
				collateral: pair.collateral,
				borrowAprPct, // Borrow APR (linear) %
				lendApyPct, // Lend APY (compounded) %
				utilizationPct: utilization * 100, // %
				totalSupplyRaw: h.totalAssetAmount,
				totalBorrowRaw: h.totalBorrowAmount,
				decimals,
				reserveFactorPct: reserveFactor * 100, // for debugging/visibility
			};
		});
	}

	private async fetchReserveFactors(addresses: `0x${string}`[]) {
		const out: Record<string, number> = {};
		if (addresses.length === 0) return out;

		// viem multicall; batches internally as needed
		const calls = addresses.map((address) => ({
			address,
			abi: FRAXLEND_ABI,
			functionName: "currentRateInfo" as const,
		}));

		const results = await publicClient.multicall({ contracts: calls });

		results.forEach((res, i) => {
			const addr = addresses[i].toLowerCase();
			if (res.status === "success") {
				const [, feeToProtocolRate] = res.result as unknown as [
					bigint,
					bigint,
					bigint,
					bigint,
					bigint,
				];
				// FEE_PRECISION = 1e5 → convert to fraction 0..1
				out[addr] = Number(feeToProtocolRate) / 100_000;
			} else {
				// fallback if a call fails
				out[addr] = DEFAULT_RESERVE_FACTOR_BPS / 10_000;
			}
		});

		return out;
	}

	// Borrow APR (linear, no compounding) – what the site labels "Borrow APR"
	private borrowAprPct(interestPerSecond: string): number {
		const r = Number(formatEther(BigInt(interestPerSecond))); // 1e18 scaled
		return r * SECONDS_PER_YEAR * 100;
	}

	// Lend APY (compounded) = Borrow APY × Util × (1 - reserve)
	private lendApyPct(
		interestPerSecond: string,
		util: number,
		reserve: number,
	): number {
		const r = Number(formatEther(BigInt(interestPerSecond)));
		const borrowApy = (1 + r) ** SECONDS_PER_YEAR - 1;
		return borrowApy * util * (1 - reserve) * 100;
	}

	formatStats(stats: Awaited<ReturnType<LendingStatsService["getStats"]>>) {
		if (stats.length === 0) {
			return dedent`
        📊 FraxLend Statistics

        No active lending pools found.
      `;
		}

		const formattedStats = stats
			.map((pool) => {
				const supply = Number(
					formatUnits(BigInt(pool.totalSupplyRaw), pool.decimals),
				).toFixed(3);
				const borrow = Number(
					formatUnits(BigInt(pool.totalBorrowRaw), pool.decimals),
				).toFixed(3);
				const util = pool.utilizationPct.toFixed(2);

				return dedent`
        🏦 ${pool.symbol}
        ├ 🔗 Address: ${pool.address}
        ├ 💸 Borrow APR: ${pool.borrowAprPct.toFixed(3)}%
        ├ 💰 Lend APY: ${pool.lendApyPct.toFixed(3)}%
        ├ 📊 Utilization: ${util}%
        ├ 📦 Total Supply: ${supply} ${pool.asset.symbol}
        ├ 📦 Total Borrow: ${borrow} ${pool.asset.symbol}
        ├ 🏷️ Asset: ${pool.asset.symbol} (${pool.asset.address})
        └ 🏷️ Collateral: ${pool.collateral.symbol} (${pool.collateral.address})
      `;
			})
			.join("\n\n");

		return dedent`
      📊 FraxLend Pool Statistics
      ═══════════════════════════

      ${formattedStats}

      Last Updated: ${new Date().toLocaleString()}
    `;
	}
}

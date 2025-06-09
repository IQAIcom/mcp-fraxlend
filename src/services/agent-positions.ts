import dedent from "dedent";
import { graphql } from "gql.tada";
import { formatWeiToNumber } from "../lib/format-number.js";
import { client } from "../lib/graphql.js";
import type { WalletService } from "./wallet.js";

const AGENT_POSITIONS_QUERY = graphql(`
  query fraxlendUsers($user: User_filter) {
    users(first: 1000, where: $user) {
      id
      positions {
        borrowedAssetShare
        lentAssetShare
        depositedCollateralAmount
        pair {
          symbol
          asset {
            symbol
						address
            decimals
          }
          collateral {
            symbol
						address
            decimals
          }
        }
        dailyHistory(first: 1, orderBy: timestamp, orderDirection: desc) {
          lentAssetValue
          lendProfitTaken
          borrowedAssetValue
          depositedCollateralValue
          timestamp
        }
      }
    }
  }
`);

export class AgentPositionsService {
	private walletService: WalletService;

	constructor(walletService: WalletService) {
		this.walletService = walletService;
	}

	async getPositions(address: string | undefined) {
		const walletClient = this.walletService.getWalletClient();
		if (!walletClient) {
			throw new Error("Wallet client not initialized");
		}
		const userAddress = address || walletClient.account?.address;
		if (!userAddress) {
			throw new Error("User address not found");
		}
		try {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const data: any = await client.request(AGENT_POSITIONS_QUERY, {
				user: {
					id: userAddress.toLowerCase(),
				},
			});
			if (
				!data.users ||
				data.users.length === 0 ||
				!data.users[0].positions ||
				data.users[0].positions.length === 0
			) {
				return [];
			}
			const positions = data.users[0].positions;

			return (
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				positions.map((position: any) => ({
					symbol: position.pair.symbol,
					assetSymbol: position.pair.asset.symbol,
					collateralSymbol: position.pair.collateral.symbol,
					assetAddress: position.pair.asset.address,
					collateralAddress: position.pair.collateral.address,
					lentAmount: position.lentAssetShare,
					borrowedAmount: position.borrowedAssetShare,
					collateralAmount: position.depositedCollateralAmount,
					value: position.dailyHistory[0]?.lentAssetValue || "0",
					borrowValue: position.dailyHistory[0]?.borrowedAssetValue || "0",
					collateralValue:
						position.dailyHistory[0]?.depositedCollateralValue || "0",
					profit: position.dailyHistory[0]?.lendProfitTaken || "0",
				})) || []
			);
		} catch (error) {
			throw new Error(
				`Failed to fetch agent positions: ${(error as Error).message}`,
			);
		}
	}

	formatPositions(
		positions: Awaited<ReturnType<AgentPositionsService["getPositions"]>>,
	) {
		if (positions.length === 0) {
			return "📊 No Active Positions Found";
		}

		const formattedPositions = positions
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			.map((pos: any) => {
				const assetSymbol = pos.assetSymbol;
				const collateralSymbol = pos.collateralSymbol;
				const assetAddress = pos.assetAddress;
				const collateralAddress = pos.collateralAddress;
				const lentAmount = formatWeiToNumber(pos.lentAmount);
				const lentValue = formatWeiToNumber(pos.value);
				const borrowedAmount = formatWeiToNumber(pos.borrowedAmount);
				const borrowValue = formatWeiToNumber(pos.borrowValue);
				const collateralAmount = formatWeiToNumber(pos.collateralAmount);
				const collateralValue = formatWeiToNumber(pos.collateralValue);
				const profit = formatWeiToNumber(pos.profit);

				return dedent`
					🔹 ${pos.symbol}
					- Lent: ${lentAmount} ${assetSymbol} (Value: $${lentValue})
					- Borrowed: ${borrowedAmount} ${assetSymbol} (Value: $${borrowValue})
					- Collateral: ${collateralAmount} ${collateralSymbol} (Value: $${collateralValue})
					- Profit: $${profit}
					- Asset address: ${assetAddress}
					- Collateral address: ${collateralAddress}
				`;
			})
			.join("\n\n");

		return `📊 *Your Active Positions*\n\n${formattedPositions}`;
	}
}

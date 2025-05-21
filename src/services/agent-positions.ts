import dedent from "dedent";
import { graphql } from "gql.tada";
import { formatWeiToNumber } from "../lib/format-number";
import { client } from "../lib/graphql";
import type { WalletService } from "./wallet";

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
            decimals
          }
          collateral {
            symbol
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

	async getPositions() {
		console.log("[FRAXLEND_GET_POSITIONS] Called to fetch agent positions");
		const walletClient = this.walletService.getWalletClient();

		if (!walletClient) {
			throw new Error("Wallet client not initialized");
		}

		const userAddress = walletClient.account?.address;

		if (!userAddress) {
			throw new Error("User address not found");
		}

		try {
			const data = await client.request(AGENT_POSITIONS_QUERY, {
				user: {
					id: userAddress.toLowerCase(),
				},
			});
			const positions = data.users[0].positions;

			return (
				positions.map((position) => ({
					symbol: position.pair.symbol,
					assetSymbol: position.pair.asset.symbol,
					collateralSymbol: position.pair.collateral.symbol,
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
			.map((pos) => {
				const lentAmount = formatWeiToNumber(pos.lentAmount);
				const lentValue = formatWeiToNumber(pos.value);
				const borrowedAmount = formatWeiToNumber(pos.borrowedAmount);
				const borrowValue = formatWeiToNumber(pos.borrowValue);
				const collateralAmount = formatWeiToNumber(pos.collateralAmount);
				const collateralValue = formatWeiToNumber(pos.collateralValue);
				const profit = formatWeiToNumber(pos.profit);

				return dedent`
					🔹 ${pos.symbol}
					- Lent: ${lentAmount} ${pos.assetSymbol} (Value: $${lentValue})
					- Borrowed: ${borrowedAmount} ${pos.assetSymbol} (Value: $${borrowValue})
					- Collateral: ${collateralAmount} ${pos.collateralSymbol} (Value: $${collateralValue})
					- Profit: $${profit}
				`;
			})
			.join("\n\n");

		return `📊 *Your Active Positions*\n\n${formattedPositions}`;
	}
}

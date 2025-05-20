import { LendingStatsService } from "../services/lending-stats"


export const lendingStatsTool = {
	name: "FRAXLEND_GET_STATS",
	description: "Get lending statistics from FraxLend pools",
	execute: async () => {
			const walletPrivateKey = process.env.ATP_WALLET_PRIVATE_KEY;
			if (!walletPrivateKey) {
				throw new Error(
					"FRAXLEND_WALLET_PRIVATE_KEY is not set. Please set it in your environment variables.",
				);
			}

			console.log(
				`[FRAXLEND_GET_STATS] Called to fetch lending statistics`,
			);
			
			try {
				const lendingStatsService = new LendingStatsService();
				const stats = await lendingStatsService.getStats();
	
				return lendingStatsService.formatStats(stats);
			} catch (error: unknown) {
				const message =
					error instanceof Error
						? error.message
						: "An unknown error occurred during the fetch.";
				console.error(`❌  [FRAXLEND_GET_STATS] Error: ${message}`);
				throw new Error(`❌ Failed to Fetch Lending Statistics: ${message}`);
			}
		},
}
import { LendingStatsService } from "../services/lending-stats";

export const lendingStatsTool = {
	name: "FRAXLEND_GET_STATS",
	description: "Get lending statistics from FraxLend pools",
	execute: async () => {
		console.log("[FRAXLEND_GET_STATS] Called to fetch lending statistics");

		try {
			const lendingStatsService = new LendingStatsService();
			const stats = await lendingStatsService.getStats();

			return lendingStatsService.formatStats(stats);
		} catch (error) {
			return `
					❌ Failed to Fetch Lending Statistics

					Error: ${(error as Error).message}

					Please try again later.
				`;
		}
	},
};

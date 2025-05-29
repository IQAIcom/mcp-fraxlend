import type { Chain } from "viem";
import { fraxtal } from "viem/chains";
import { AgentPositionsService } from "../services/agent-positions.js";
import { WalletService } from "../services/wallet.js";

export const agentPositionsTool = {
	name: "FRAXLEND_GET_POSITIONS",
	description: "Get your positions in FraxLend pools",
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	execute: async (args: unknown, { log }: { log: any }) => {
		const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
		if (!walletPrivateKey) {
			throw new Error(
				"WALLET_PRIVATE_KEY is not set. Please set it in your environment variables.",
			);
		}

		log.debug("[FRAXLEND_GET_POSITIONS] Called to fetch agent positions");

		try {
			const walletService = new WalletService(walletPrivateKey, fraxtal);
			const agentPositionsService = new AgentPositionsService(walletService);
			const positions = await agentPositionsService.getPositions();

			return agentPositionsService.formatPositions(positions);
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred during the fetch.";
			throw new Error(`Failed to fetch agent positions: ${message}`);
		}
	},
};

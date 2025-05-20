import { z } from "zod";
import { AgentPositionsService } from "../services/agent-positions"
import { WalletService } from "../services/wallet";

export const agentPositionsTool = {
	name: "FRAXLEND_GET_POSITIONS",
	description: "Get your positions in FraxLend pools",
	execute: async () => {
		const walletPrivateKey = process.env.ATP_WALLET_PRIVATE_KEY;
		if (!walletPrivateKey) {
			throw new Error(
				"FRAXLEND_WALLET_PRIVATE_KEY is not set. Please set it in your environment variables.",
			);
		}

		console.log(
			`[FRAXLEND_GET_POSITIONS] Called to fetch agent positions`,
		);
		
		try {
			const walletService = new WalletService(walletPrivateKey);

			// const walletService = new WalletService(
			// 	walletPrivateKey,
			// 	chain: chain as Chain,
			// );
			const agentPositionsService = new AgentPositionsService(walletService);
			const positions = await agentPositionsService.getPositions();

			return agentPositionsService.formatPositions(positions);
		} catch (error) {
			return `
					❌ Failed to Fetch Positions

					Error: ${error.message}

					Please try again later.
				`;
		}
	},
}
import { z } from "zod";
import { AgentPositionsService } from "../services/agent-positions"
import { WalletService } from "../services/wallet";
import type { Chain } from "viem";

const agentPositionsParamsSchema = z.object({
	chain: z
		.string()
		.optional()
		.describe("The blockchain network to execute the transaction on."),
});

export const agentPositionsTool = {
	name: "FRAXLEND_GET_POSITIONS",
	description: "Get your positions in FraxLend pools",
	parameters: agentPositionsParamsSchema,
	execute: async (args: z.infer<typeof agentPositionsParamsSchema>) => {
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
			// const walletService = new WalletService(walletPrivateKey);
			const walletService = new WalletService(
				walletPrivateKey,
				args.chain ? (args.chain as unknown as Chain) : undefined
			  );
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
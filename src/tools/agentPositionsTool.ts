import { fraxtal } from "viem/chains";
import { AgentPositionsService } from "../services/agent-positions.js";
import { WalletService } from "../services/wallet.js";
import { z } from "zod";

const agentPositionsParamsSchema = z.object({
	address: z
		.string()
		.optional()
		.describe("The address of the user to get the positions for"),
});

export const agentPositionsTool = {
	name: "FRAXLEND_GET_POSITIONS",
	description: "Get your positions in FraxLend pools",
	parameters: agentPositionsParamsSchema,
	execute: async (args: z.infer<typeof agentPositionsParamsSchema>) => {
		const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
		if (!walletPrivateKey && !args.address) {
			throw new Error(
				"WALLET_PRIVATE_KEY is not set. Please set it in your environment variables or provide an address.",
			);
		}
		try {
			const walletService = new WalletService(walletPrivateKey, fraxtal);
			const agentPositionsService = new AgentPositionsService(walletService);
			const positions = await agentPositionsService.getPositions(args.address);

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

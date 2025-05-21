import type { Chain } from "viem";
import { z } from "zod";
import { AgentPositionsService } from "../services/agent-positions.js";
import { WalletService } from "../services/wallet.js";

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
	execute: async (
		args: z.infer<typeof agentPositionsParamsSchema>,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		{ log }: { log: any },
	) => {
		const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
		if (!walletPrivateKey) {
			throw new Error(
				"WALLET_PRIVATE_KEY is not set. Please set it in your environment variables.",
			);
		}

		log.debug("[FRAXLEND_GET_POSITIONS] Called to fetch agent positions");

		try {
			const walletService = new WalletService(
				walletPrivateKey,
				args.chain ? (args.chain as unknown as Chain) : undefined,
			);
			const agentPositionsService = new AgentPositionsService(walletService);
			const positions = await agentPositionsService.getPositions();

			return agentPositionsService.formatPositions(positions);
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred during the fetch.";
			log.error(`❌  [FRAXLEND_GET_POSITIONS] Error: ${message}`);
			throw new Error(`❌ Failed to Fetch Positions ${message}`);
		}
	},
};

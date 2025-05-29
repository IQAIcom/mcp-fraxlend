import type { Address } from "viem";
import { z } from "zod";
import { formatWeiToNumber } from "../lib/format-number.js";
import { LendService } from "../services/lend.js";
import { WalletService } from "../services/wallet.js";
import { fraxtal } from "viem/chains";

const lendParamsSchema = z.object({
	pairAddress: z
		.string()
		.startsWith("0x", {
			message:
				"Token contract must be a valid Ethereum address starting with 0x.",
		})
		.describe("The contract address of the agent token to sell."),
	amount: z
		.string()
		.regex(/^\d+(\.\d+)?$/, { message: "Amount must be a valid number." })
		.describe(
			"The amount of base currency (IQ) to spend for buying the agent token.",
		),
});

export const lendTool = {
	name: "FRAXLEND_LEND",
	description: "Lend assets to a FraxLend pool",
	parameters: lendParamsSchema,
	execute: async (args: z.infer<typeof lendParamsSchema>) => {
		const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
		if (!walletPrivateKey) {
			throw new Error(
				"WALLET_PRIVATE_KEY is not set in the environment. This is required to execute trades.",
			);
		}

		console.log(
			`[FRAXLEND_LEND] Called with token ${args.pairAddress}, amount: ${args.amount}`,
		);

		try {
			const walletService = new WalletService(walletPrivateKey, fraxtal);
			const lendService = new LendService(walletService);

			const result = await lendService.execute({
				pairAddress: args.pairAddress as Address,
				amount: BigInt(args.amount),
			});

			return `
					✅ Lending Transaction Successful

					💰 Amount: ${formatWeiToNumber(args.amount)} tokens
					🔗 Transaction: ${result.txHash}

					Your assets have been successfully supplied to the FraxLend pool.
				`;
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred during the transaction.";
			console.log(`[FRAXLEND_LEND] Error: ${message}`);
			throw new Error(`Failed to add collateral: ${message}`);
		}
	},
};

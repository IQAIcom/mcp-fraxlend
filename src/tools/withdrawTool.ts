import type { Address } from "viem";
import { fraxtal } from "viem/chains";
import { z } from "zod";
import { formatWeiToNumber } from "../lib/format-number.js";
import { WalletService } from "../services/wallet.js";
import { WithdrawService } from "../services/withdraw.js";

const withdrawParamsSchema = z.object({
	pairAddress: z
		.string()
		.startsWith("0x", {
			message:
				"Token contract must be a valid Fraxtal address starting with 0x.",
		})
		.describe("The contract address of the asset to withdraw."),
	amount: z
		.string()
		.regex(/^\d+(\.\d+)?$/, { message: "Amount must be a valid number." })
		.describe("The amount for the asset to withdraw from the FraxLend pool."),
});

export const withdrawTool = {
	name: "FRAXLEND_WITHDRAW",
	description: "Withdraw assets from a FraxLend pool",
	parameters: withdrawParamsSchema,
	execute: async (args: z.infer<typeof withdrawParamsSchema>) => {
		const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
		if (!walletPrivateKey) {
			throw new Error(
				"WALLET_PRIVATE_KEY is not set in the environment. This is required to execute trades.",
			);
		}

		console.log(
			`[FRAXLEND_WITHDRAW] Called with token ${args.pairAddress}, amount: ${args.amount}`,
		);

		try {
			const walletService = new WalletService(walletPrivateKey, fraxtal);
			const withdrawService = new WithdrawService(walletService);

			const result = await withdrawService.execute({
				pairAddress: args.pairAddress as Address,
				amount: BigInt(args.amount),
			});

			return `
						✅ Withdrawal Transaction Successful
	
						🔒 Amount: ${formatWeiToNumber(args.amount)} tokens
						🔗 Transaction: ${result.txHash}
	
						Your assets have been withdrawn from the FraxLend pool.
					`;
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred during the transaction.";
			console.log(`[FRAXLEND_WITHDRAW] Error: ${message}`);
			throw new Error(`Failed to withdraw: ${message}`);
		}
	},
};

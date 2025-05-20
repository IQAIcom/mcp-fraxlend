import { z } from "zod";
import { WalletService } from "../services/wallet";
import { formatWeiToNumber } from "../lib/format-number";
import { RepayService } from "../services/repay"
import type { Address } from "viem";

const repayParamsSchema = z.object({
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


export const repayTool = {
	name: "FRAXLEND_REPAY",
	description: "Repay borrowed assets to a FraxLend pool",
	parameters: repayParamsSchema,
		execute: async (args: z.infer<typeof repayParamsSchema>) => {
	
		const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
			if (!walletPrivateKey) {
				throw new Error(
					"WALLET_PRIVATE_KEY is not set in the environment. This is required to execute trades.",
				);
			}
	
		console.log(
				`[FRAXLEND_REPAY] Called with token ${args.pairAddress}, amount: ${args.amount}`,
			);
	
		try {
				const walletService = new WalletService(walletPrivateKey);
				// const walletService = new WalletService(
				// 	walletPrivateKey,
				// 	chain: chain as Chain,
				// );
				const repayService = new RepayService(walletService);
	
				const result = await repayService.execute({
					pairAddress: args.pairAddress as Address,
					amount: BigInt(args.amount),
				});
	
				return `
						✅ Repayment Transaction Successful
	
						🔒 Amount: ${formatWeiToNumber(args.amount)} tokens
						🔗 Transaction: ${result.txHash}
	
						Your debt has been repaid to the FraxLend pool.
					`;
	
			} catch (error: unknown) {
				const message =
					error instanceof Error
						? error.message
						: "An unknown error occurred during the transaction.";
				console.error(`[FRAXLEND_REPAY] Error: ${message}`);
				throw new Error(`Failed to add collateral: ${message}`);
			}
	
	
	  }
}
import type { Address } from "viem";
import { fraxtal } from "viem/chains";
import { z } from "zod";
import { formatWeiToNumber } from "../lib/format-number.js";
import { BorrowService } from "../services/borrow.js";
import { WalletService } from "../services/wallet.js";

const borrowParamsSchema = z.object({
	pairAddress: z
		.string()
		.startsWith("0x", {
			message:
				"Token contract must be a valid Fraxtal address starting with 0x.",
		})
		.describe("The contract address of the agent token to sell."),
	receiver: z
		.string()
		.startsWith("0x", {
			message:
				"Receiver address must be a valid Fraxtal address starting with 0x.",
		})
		.describe("The address to receive the borrowed assets."),
	collateralAmount: z
		.string()
		.regex(/^\d+(\.\d+)?$/, { message: "Amount must be a valid number." })
		.describe(
			"The amount for the collateral asset to deposit in the FraxLend pool.",
		),
	borrowAmount: z
		.string()
		.regex(/^\d+(\.\d+)?$/, { message: "Amount must be a valid number." })
		.describe("The amount for the asset to borrow from the FraxLend pool."),
});

export const borrowTool = {
	name: "FRAXLEND_BORROW",
	description: "Borrow assets from a FraxLend pool",
	parameters: borrowParamsSchema,
	execute: async (args: z.infer<typeof borrowParamsSchema>) => {
		const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
		if (!walletPrivateKey) {
			throw new Error(
				"WALLET_PRIVATE_KEY is not set in the environment. This is required to execute trades.",
			);
		}

		console.log(
			`[FRAXLEND_BORROW] Called with token ${args.pairAddress}, amount: ${args.borrowAmount}, receiver: ${args.receiver}`,
		);

		try {
			const walletService = new WalletService(walletPrivateKey, fraxtal);
			const borrowService = new BorrowService(walletService);

			const result = await borrowService.execute({
				pairAddress: args.pairAddress as Address,
				borrowAmount: BigInt(args.borrowAmount),
				collateralAmount: BigInt(args.collateralAmount),
				receiver: args.receiver as Address,
			});

			return `
					✅ Borrowing Transaction Successful
		
					💸 Borrow Amount: ${formatWeiToNumber(args.borrowAmount)} tokens
					🔒 Collateral Amount: ${formatWeiToNumber(args.collateralAmount)} tokens
					📬 Receiver: ${args.receiver}
					🔗 Transaction: ${result.txHash}
		
					Funds have been borrowed from the FraxLend pool.
				`;
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred during the transaction.";
			console.log(`❌  [FRAXLEND_BORROW] Error: ${message}`);
			throw new Error(`Failed to add collateral: ${message}`);
		}
	},
};

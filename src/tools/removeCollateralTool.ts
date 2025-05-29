import type { Address } from "viem";
import { fraxtal } from "viem/chains";
import { z } from "zod";
import { formatWeiToNumber } from "../lib/format-number.js";
import { RemoveCollateralService } from "../services/remove-collateral.js";
import { WalletService } from "../services/wallet.js";

const removeCollateralParamsSchema = z.object({
	pairAddress: z
		.string()
		.startsWith("0x", {
			message:
				"Token contract must be a valid Fraxtal address starting with 0x.",
		})
		.describe("The contract address of the agent token to sell."),
	amount: z
		.string()
		.regex(/^\d+(\.\d+)?$/, { message: "Amount must be a valid number." })
		.describe(
			"The amount for the asset to remove collateral from the FraxLend pool.",
		),
});

export const removeCollateralTool = {
	name: "FRAXLEND_REMOVE_COLLATERAL",
	description: "Remove collateral from a FraxLend position",
	parameters: removeCollateralParamsSchema,
	execute: async (args: z.infer<typeof removeCollateralParamsSchema>) => {
		const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
		if (!walletPrivateKey) {
			throw new Error(
				"WALLET_PRIVATE_KEY is not set in the environment. This is required to execute trades.",
			);
		}

		console.log(
			`[FRAXLEND_REMOVE_COLLATERAL] Called with token ${args.pairAddress}, amount: ${args.amount}`,
		);

		try {
			const walletService = new WalletService(walletPrivateKey, fraxtal);
			const removeCollateralService = new RemoveCollateralService(
				walletService,
			);

			const result = await removeCollateralService.execute({
				pairAddress: args.pairAddress as Address,
				amount: BigInt(args.amount),
			});

			return `
						✅ Collateral Removal Successful
	
						🔒 Amount: ${formatWeiToNumber(args.amount)} tokens
						🔗 Transaction: ${result.txHash}
	
						Collateral has been removed from your FraxLend position.
					`;
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred during the transaction.";
			console.log(`[FRAXLEND_REMOVE_COLLATERAL] Error: ${message}`);
			throw new Error(`Failed to remove collateral: ${message}`);
		}
	},
};

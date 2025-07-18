import type { Address } from "viem";
import { fraxtal } from "viem/chains";
import { z } from "zod";
import { formatWeiToNumber } from "../lib/format-number.js";
import { AddCollateralService } from "../services/add-collateral.js";
import { WalletService } from "../services/wallet.js";

const addCollateralParamsSchema = z.object({
	pairAddress: z
		.string()
		.startsWith("0x", {
			message:
				"Token contract must be a valid Fraxtal address starting with 0x.",
		})
		.describe("The contract address of the asset to add as collateral."),
	amount: z
		.string()
		.regex(/^\d+(\.\d+)?$/, { message: "Amount must be a valid number." })
		.describe(
			"The amount for the asset to add as collateral in the FraxLend pool.",
		),
});

export const addCollateralTool = {
	name: "FRAXLEND_ADD_COLLATERAL",
	description: "Add collateral to a FraxLend position",
	parameters: addCollateralParamsSchema,
	execute: async (args: z.infer<typeof addCollateralParamsSchema>) => {
		const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
		if (!walletPrivateKey) {
			throw new Error(
				"WALLET_PRIVATE_KEY is not set in the environment. This is required to execute trades.",
			);
		}

		console.log(
			`[FRAXLEND_ADD_COLLATERAL] Called with token ${args.pairAddress}, amount: ${args.amount}`,
		);

		try {
			const walletService = new WalletService(walletPrivateKey, fraxtal);
			const addCollateralService = new AddCollateralService(walletService);

			const result = await addCollateralService.execute({
				pairAddress: args.pairAddress as Address,
				amount: BigInt(args.amount),
			});

			return `
					✅ Collateral Addition Successful

					🔒 Amount: ${formatWeiToNumber(args.amount)} tokens
					🔗 Transaction: ${result.txHash}

					Collateral has been added to your FraxLend position.
				`;
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred during the transaction.";
			console.log(`[FRAXLEND_ADD_COLLATERAL] Error: ${message}`);
			throw new Error(`Failed to add collateral: ${message}`);
		}
	},
};

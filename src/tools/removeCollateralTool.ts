import { z } from "zod";
import { WalletService } from "../services/wallet";
import { formatWeiToNumber } from "../lib/format-number";
import { RemoveCollateralService } from "../services/remove-collateral"
import type { Address, Chain } from "viem";

const removeCollateralParamsSchema = z.object({
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
	chain: z
		.string()
		.optional()
		.describe("The blockchain network to execute the transaction on."),
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
				// const walletService = new WalletService(walletPrivateKey);
				const walletService = new WalletService(
					walletPrivateKey,
					args.chain ? (args.chain as unknown as Chain) : undefined
				  );
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
				console.error(`[FRAXLEND_REMOVE_COLLATERAL] Error: ${message}`);
				throw new Error(`Failed to remove collateral: ${message}`);
			}
	
	
	  }
}
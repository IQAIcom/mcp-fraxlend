import { z } from "zod";
import { PairAddressService } from "../services/pair-address.js";
import { WalletService } from "../services/wallet.js";
import { fraxtal } from "viem/chains";

const pairAddressParamsSchema = z.object({
	assetSymbol: z.string().optional().describe("The symbol of the asset token."),
	collateralSymbol: z
		.string()
		.optional()
		.describe("The symbol of the collateral token."),
	sortByApr: z
		.enum(["highest", "lowest"])
		.optional()
		.describe("Sort the results by APR, either highest or lowest."),
});

export const pairAddressTool = {
	name: "FRAXLEND_GET_PAIR_ADDRESS",
	description: "Get FraxLend pair addresses and pool information",
	parameters: pairAddressParamsSchema,
	execute: async (args: z.infer<typeof pairAddressParamsSchema>) => {
		const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
		if (!walletPrivateKey) {
			throw new Error(
				"WALLET_PRIVATE_KEY is not set in the environment. This is required to execute trades.",
			);
		}

		console.log(
			`[FRAXLEND_GET_PAIR_ADDRESS] Called with assetSymbol: ${args.assetSymbol}, collateralSymbol: ${args.collateralSymbol}, sortByApr: ${args.sortByApr}`,
		);

		try {
			if (!args.assetSymbol && !args.collateralSymbol) {
				throw new Error(
					"At least one token symbol (asset or collateral) is required",
				);
			}

			const walletService = new WalletService(walletPrivateKey, fraxtal);
			const pairAddressService = new PairAddressService(walletService);

			const pairs = await pairAddressService.getPairAddress({
				assetSymbol: args.assetSymbol,
				collateralSymbol: args.collateralSymbol,
				sortByApr: args.sortByApr,
			});

			return pairAddressService.formatPairAddresses(pairs);
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred during the fetch.";
			console.log(`[FRAXLEND_GET_PAIR_ADDRESS] Error: ${message}`);
			throw new Error(`Failed to Fetch Pair Address: ${message}`);
		}
	},
};

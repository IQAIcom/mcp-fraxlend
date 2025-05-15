import type { Chain } from "viem";

export interface FraxLendActionParams {
	walletPrivateKey?: string;
	chain?: Chain;
}

export type Tool = {
  (params: { amount: string; asset: string; model: string } | { model: string }): Promise<string>;
  description: string;
  parameters: string[];
  name: string;
  similes: string[];
};

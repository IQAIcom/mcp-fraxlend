# Fraxlend MCP Server

[![npm version](https://img.shields.io/npm/v/@iqai/mcp-fraxlend.svg)](https://www.npmjs.com/package/@iqai/mcp-fraxlend)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

The Fraxlend MCP Server enables AI agents to interact with [Fraxlend](https://frax.finance), a DeFi lending protocol on Fraxtal. This server provides comprehensive access to lending pools, allowing agents to view statistics, lend assets, borrow, manage collateral, repay loans, and withdraw funds.

By implementing the Model Context Protocol (MCP), this server allows Large Language Models (LLMs) to interact with Fraxlend pools, manage positions, and execute DeFi operations directly through their context window.

## Features

*   **Pool Discovery**: Search and filter FraxLend pools by asset and collateral tokens.
*   **Lending Operations**: Lend assets to earn yield from borrowers.
*   **Borrowing**: Borrow assets against collateral from FraxLend pools.
*   **Collateral Management**: Add or remove collateral from lending positions.
*   **Position Tracking**: Monitor your lending and borrowing positions across pools.
*   **Loan Repayment**: Repay borrowed assets to reduce debt.

## Installation

### Using npx (Recommended)

To use this server without installing it globally:

```bash
npx @iqai/mcp-fraxlend
```

### Build from Source

```bash
git clone https://github.com/IQAIcom/mcp-fraxlend.git
cd mcp-fraxlend
pnpm install
pnpm run build
```

## Running with an MCP Client

Add the following configuration to your MCP client settings (e.g., `claude_desktop_config.json`).

### Minimal Configuration

```json
{
  "mcpServers": {
    "fraxlend": {
      "command": "npx",
      "args": ["-y", "@iqai/mcp-fraxlend"],
      "env": {
        "WALLET_PRIVATE_KEY": "your_wallet_private_key_here"
      }
    }
  }
}
```

### Advanced Configuration (Local Build)

```json
{
  "mcpServers": {
    "fraxlend": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-fraxlend/dist/index.js"],
      "env": {
        "WALLET_PRIVATE_KEY": "your_wallet_private_key_here"
      }
    }
  }
}
```

## Configuration (Environment Variables)

| Variable | Required | Description | Default |
| :--- | :--- | :--- | :--- |
| `WALLET_PRIVATE_KEY` | Yes | Your wallet private key for signing transactions | - |

**Security Note:** Handle your private key with extreme care. Ensure it is stored securely and only provided to trusted MCP client configurations.

## Usage Examples

### Pool Discovery
*   "What FraxLend pools are available for FRAX?"
*   "Find pools where I can use ETH as collateral."
*   "Show me the highest APR lending pools."

### Lending & Borrowing
*   "Lend 1000 FRAX to the FRAX/sfrxETH pool."
*   "Borrow 500 FRAX using my sfrxETH as collateral."
*   "What are my current positions in FraxLend?"

### Position Management
*   "Add more collateral to my borrowing position."
*   "Remove excess collateral from my position."
*   "Repay my loan in the FRAX pool."
*   "Withdraw my lent assets from the pool."

## MCP Tools

<!-- AUTO-GENERATED TOOLS START -->

### `FRAXLEND_ADD_COLLATERAL`
Add collateral to a FraxLend position

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pairAddress` | string | Yes | The contract address of the asset to add as collateral. |
| `amount` | string | Yes | The amount for the asset to add as collateral in the FraxLend pool. |

### `FRAXLEND_BORROW`
Borrow assets from a FraxLend pool

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pairAddress` | string | Yes | The contract address of the agent token to sell. |
| `receiver` | string | Yes | The address to receive the borrowed assets. |
| `collateralAmount` | string | Yes | The amount for the collateral asset to deposit in the FraxLend pool. |
| `borrowAmount` | string | Yes | The amount for the asset to borrow from the FraxLend pool. |

### `FRAXLEND_GET_PAIR_ADDRESS`
Get FraxLend pair addresses and pool information

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `assetSymbol` | string |  | The symbol of the asset token. |
| `collateralSymbol` | string |  | The symbol of the collateral token. |
| `sortByApr` | string |  | Sort the results by APR, either highest or lowest. |

### `FRAXLEND_GET_POSITIONS`
Get your positions in FraxLend pools

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | string |  | The address of the user to get the positions for |

### `FRAXLEND_LEND`
Lend assets to a FraxLend pool

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pairAddress` | string | Yes | The contract address of the asset to lend. |
| `amount` | string | Yes | The amount for the asset to lend in the FraxLend pool. |

### `FRAXLEND_REMOVE_COLLATERAL`
Remove collateral from a FraxLend position

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pairAddress` | string | Yes | The contract address of the asset to remove as collateral. |
| `amount` | string | Yes | The amount for the asset to remove collateral from the FraxLend pool. |

### `FRAXLEND_REPAY`
Repay borrowed assets to a FraxLend pool

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pairAddress` | string | Yes | The contract address of the asset to repay. |
| `amount` | string | Yes | The amount for the asset to repay in the FraxLend pool. |

### `FRAXLEND_WITHDRAW`
Withdraw assets from a FraxLend pool

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pairAddress` | string | Yes | The contract address of the asset to withdraw. |
| `amount` | string | Yes | The amount for the asset to withdraw from the FraxLend pool. |

<!-- AUTO-GENERATED TOOLS END -->

## Development

### Build Project
```bash
pnpm run build
```

### Development Mode (Watch)
```bash
pnpm run watch
```

### Linting & Formatting
```bash
pnpm run lint
pnpm run format
```

### Project Structure
*   `src/tools/`: Individual tool definitions
*   `src/services/`: Business logic and blockchain interactions
*   `src/lib/`: Shared utilities
*   `src/index.ts`: Server entry point

## Resources

*   [Fraxlend Documentation](https://docs.frax.finance/fraxlend/fraxlend-overview)
*   [Model Context Protocol (MCP)](https://modelcontextprotocol.io)
*   [Frax Finance](https://frax.finance)

## Disclaimer

This project is an unofficial tool and is not directly affiliated with Frax Finance. It interacts with DeFi protocols and blockchain transactions. Users should exercise caution, verify all data independently, and understand the risks involved in lending, borrowing, and managing collateral in DeFi protocols.

## License

[MIT](LICENSE)

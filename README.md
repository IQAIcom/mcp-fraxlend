# MCP Fraxlend

## Description

MCP Fraxlend is an MCP server that provides tools for interacting with the Fraxlend protocol. It allows users to add collateral, borrow assets, repay borrowed assets, and retrieve information about the protocol.

## Installation

To install MCP Fraxlend, run the following command:

```bash
pnpm install
```

## Usage

To use MCP Fraxlend, you need to have Node.js and pnpm installed.

1.  Clone the repository:

```bash
git clone <repository_url>
```

2.  Navigate to the `mcp-fraxlend` directory:

```bash
cd mcp-fraxlend
```

3.  Install the dependencies:

```bash
pnpm install
```

4.  Run the server:

```bash
pnpm dev
```

The server will start and listen for requests.

## Tools

The following tools are available:

- `addCollateral`: Adds collateral to a Fraxlend position.
  - Parameters: `amount`, `asset`, `model`
- `borrow`: Borrows assets from Fraxlend.
  - Parameters: `amount`, `asset`, `model`
- `repay`: Repays borrowed assets to Fraxlend.
  - Parameters: `amount`, `asset`, `model`
- `agentPositions`: Gets agent positions from Fraxlend.
  - Parameters: `model`
- `lend`: Lends assets to Fraxlend.
  - Parameters: `amount`, `asset`, `model`
- `lendingStats`: Gets lending stats from Fraxlend.
  - Parameters: `model`
- `pairAddress`: Gets pair address from Fraxlend.
  - Parameters: `model`
- `removeCollateral`: Removes collateral from a Fraxlend position.
  - Parameters: `amount`, `asset`, `model`
- `wallet`: Gets wallet information from Fraxlend.
  - Parameters: `model`
- `withdraw`: Withdraws assets from Fraxlend.
  - Parameters: `amount`, `asset`, `model`

## Configuration

The server uses a `config.json` file to store configuration settings, such as the default lending model.

## Example Usage

To use the tools, you can send a request to the server with the tool name and parameters. For example:

```
borrow amount=10 asset=DAI model=Fraxlend
repay amount=3 asset=loan model=Fraxlend
agentPositions model=Fraxlend
```

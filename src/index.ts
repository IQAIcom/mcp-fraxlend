import { FastMCP } from "fastmcp";
import { addCollateralTool } from "./tools/addCollateralTool.js";
import { agentPositionsTool } from "./tools/agentPositionsTool.js";
import { borrowTool } from "./tools/borrowTool.js";
import { lendTool } from "./tools/lendTool.js";
import { lendingStatsTool } from "./tools/lendingStatsTool.js";
import { pairAddressTool } from "./tools/pairAddressTool.js";
import { removeCollateralTool } from "./tools/removeCollateralTool.js";
import { repayTool } from "./tools/repayTool.js";
import { withdrawTool } from "./tools/withdrawTool.js";

async function main() {
	console.log("Initializing MCP Fraxlend Server...");

	const server = new FastMCP({
		name: "IQAI Fraxlend MCP Server",
		version: "0.0.1",
	});

	server.addTool(addCollateralTool);
	server.addTool(agentPositionsTool);
	server.addTool(borrowTool);
	server.addTool(lendingStatsTool);
	server.addTool(lendTool);
	server.addTool(pairAddressTool);
	server.addTool(removeCollateralTool);
	server.addTool(repayTool);
	server.addTool(withdrawTool);

	try {
		await server.start({
			transportType: "stdio",
		});
		console.log("✅ IQ Fraxlend MCP Server started successfully over stdio.");
		console.log("You can now connect to it using an MCP client.");
	} catch (error) {
		console.error("❌ Failed to start IQ Fraxlend MCP Server:", error);
		process.exit(1);
	}
}

main().catch((error) => {
	console.error("❌ An unexpected error occurred:", error);
	process.exit(1);
});

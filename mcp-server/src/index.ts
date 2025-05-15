import * as fs from "fs";
import { getAllTools } from "./tool-selector";

// Dummy function to simulate AI parsing
const parseMultiToolInput = (input: string): any[] => {
  const actions = [];
  if (input.includes("borrow")) {
    actions.push({ toolName: "borrow", params: { amount: "10", asset: "DAI", model: "Fraxlend" } });
  }
  if (input.includes("repay")) {
    actions.push({ toolName: "repay", params: { amount: "3", asset: "loan", model: "Fraxlend" } });
    actions.push({ toolName: "repay", params: { amount: "7", asset: "loan", model: "Fraxlend" } });
  }
  if (input.includes("agentPositions")) {
    actions.push({ toolName: "agentPositions", params: { model: "Fraxlend" } });
  }
  if (input.includes("lendingStats")) {
    actions.push({ toolName: "lendingStats", params: { model: "Fraxlend" } });
  }
  if (input.includes("pairAddress")) {
    actions.push({ toolName: "pairAddress", params: { model: "Fraxlend" } });
  }
  if (input.includes("wallet")) {
    actions.push({ toolName: "wallet", params: { model: "Fraxlend" } });
  }
  return actions;
};

// Dummy function to simulate input parsing
const parseInput = (input: string): { agentName: string; toolName: string; params: { [key: string]: string } } => {
  const parts = input.split(' ');
  const agentName = parts[0];
  const toolName = parts[1];
  const params: { [key: string]: string } = {};

  for (let i = 2; i < parts.length; i++) {
    const paramParts = parts[i].split('=');
    if (paramParts.length === 2) {
      const key = paramParts[0];
      const value = paramParts[1];
    }
  }

  return { agentName, toolName, params };
};

const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));

const main = async () => {
  const input = process.argv.slice(2).join(' ');

  // Simulate AI parsing of the input
  const actions = parseMultiToolInput(input);

  for (const action of actions) {
    const { toolName, params } = action;
    const tools = getAllTools();
    const selectedTool = tools.find((tool: any) => tool.name === toolName) as any;

    if (selectedTool) {
      try {
        const model = config.defaultModel; // Use default model for now

        if (selectedTool.parameters && Object.keys(selectedTool.parameters).length > 0) {
          try {
            const toolParams: any = {};
            for (const paramName of Object.keys(selectedTool.parameters)) {
              if (params[paramName]) {
                toolParams[paramName] = params[paramName];
              }
            }
            const result = await selectedTool.function(toolParams);
            console.log("Calling tool " + toolName + " with params: " + JSON.stringify(toolParams));
          } catch (error) {
            console.error("Error executing tool " + toolName + ":", error);
          }
        } else {
          try {
            const result = await selectedTool.function({});
            console.log("Calling tool " + toolName + " with no parameters");
          } catch (error) {
            console.error("Error executing tool " + toolName + ":", error);
          }
        }
      } catch (error) {
        console.error("Error executing tool " + toolName + ":", error);
      }
    } else {
      console.error("Tool " + toolName + " not found.");
    }
  }
};

main();

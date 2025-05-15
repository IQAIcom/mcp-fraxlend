import * as fs from 'fs';

const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));

export const parseInput = (input: string): { agentName: string; toolName: string; params: { [key: string]: string } } => {
  const parts = input.split(' ');
  const agentName = parts[0];
  const toolName = parts[1];
  const params: { [key: string]: string } = {};

  for (let i = 2; i < parts.length; i++) {
    const paramParts = parts[i].split('=');
    if (paramParts.length === 2) {
      const key = paramParts[0];
      const value = paramParts[1];
      params[key] = value;
    }
  }

  return { agentName, toolName, params };
};

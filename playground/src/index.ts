import { getAllTools } from 'mcp-fraxlend/src/tool-selector.js';

const tools = getAllTools();
const lendTool = tools.find(tool => tool.name === 'lend');

if (lendTool) {
  const params = { amount: '100', asset: 'DAI', model: 'Fraxlend' };
  lendTool(params)
    .then(result => console.log(result))
    .catch(error => console.error(error));
} else {
  console.log('Lend tool not found');
}

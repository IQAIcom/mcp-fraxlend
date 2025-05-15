const lend = async (params: { amount: string; asset: string; model: string }) => {
  // Implement lend logic here
  console.log(`Lending ${params.amount} ${params.asset} using model ${params.model}`);
  return { result: `Lending ${params.amount} ${params.asset} using model ${params.model}` };
};

lend.name = 'lend';
lend.description = 'Lend assets to Fraxlend';
lend.parameters = {
  amount: { type: 'string', description: 'The amount to lend' },
  asset: { type: 'string', description: 'The asset to lend' },
  model: { type: 'string', description: 'The lending model to use' }
};
lend.similes = ['supply', 'deposit'];

export default lend;

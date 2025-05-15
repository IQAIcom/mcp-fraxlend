const removeCollateral = async (params: { amount: string; asset: string; model: string }) => {
  // Implement remove collateral logic here
  console.log(`Removing ${params.amount} ${params.asset} as collateral using model ${params.model}`);
  return { result: `Removing ${params.amount} ${params.asset} as collateral using model ${params.model}` };
};

removeCollateral.name = 'removeCollateral';
removeCollateral.description = 'Remove collateral from a Fraxlend position';
removeCollateral.parameters = {
  amount: { type: 'string', description: 'The amount to remove as collateral' },
  asset: { type: 'string', description: 'The asset to remove as collateral' },
  model: { type: 'string', description: 'The lending model to use' }
};
removeCollateral.similes = ['remove', 'withdraw'];

export default removeCollateral;

import { parseCreateLoanInput } from '../../input-parser';

export const addCollateral = {
    name: "FRAXLEND_ADD_COLLATERAL",
    description: "Add collateral to a FraxLend position",
    similes: [
        "ADD_COLLATERAL",
        "DEPOSIT_COLLATERAL",
        "INCREASE_COLLATERAL",
        "SECURE_POSITION",
        "BOOST_COLLATERAL",
    ],
  run: async (input: unknown) => {
    const parsed = parseCreateLoanInput(input);
    // Your actual logic here
    
  }
};

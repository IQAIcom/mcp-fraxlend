//write tool selector ie to select a tool from the list of tools in the tools folder which is calling respective service
import { addCollateral } from './core/tools/add-collateral-tool';
// import { borrow } from './core/tools/borrow-tool';

export const getAllTools = () => [
    addCollateral,
    // Add more tools here
  ];

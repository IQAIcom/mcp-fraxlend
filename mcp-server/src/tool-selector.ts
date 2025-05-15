//write tool selector ie to select a tool from the list of tools in the tools folder which is calling respective service
import addCollateral from './core/tools/add-collateral-tool';
import borrow from './core/tools/borrow-tool';
import repay from './core/tools/repay-tool';
import agentPositions from './core/tools/agent-positions-tool';
import lend from './core/tools/lend-tool';
import lendingStats from './core/tools/lending-stats-tool';
import pairAddress from './core/tools/pair-address-tool';
import removeCollateral from './core/tools/remove-collateral-tool';
import wallet from './core/tools/wallet-tool';
import withdraw from './core/tools/withdraw-tool';

export const getAllTools = () => [
    addCollateral,
    borrow,
    repay,
    agentPositions,
    lend,
    lendingStats,
    pairAddress,
    removeCollateral,
    wallet,
    withdraw
  ];

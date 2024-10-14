import { initializeConnector } from "@web3-react/core";
import { WalletConnect } from "@web3-react/walletconnect-v2";
// import { Core } from '@walletconnect/core';
// import { Web3Wallet } from '@walletconnect/web3wallet';

import { CHAINS } from "data/networks";

const [mainnet, ...optionalChains] = Object.keys(CHAINS).map(Number);

export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
  (actions) =>
    new WalletConnect({
      actions,
      options: {
        projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID ?? "fba1325852fabad486bab619f8300d1c",
        chains: [mainnet],
        optionalChains,
        showQrModal: true
      },
      onError: (error) => {
        console.error("WalletConnect Error:", error);
      },
    })
);

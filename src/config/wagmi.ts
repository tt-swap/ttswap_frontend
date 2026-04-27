
import { type Chain, getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  binanceWallet,
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  uniswapWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
// import { publicActions,createPublicClient } from 'viem';
import { http } from 'wagmi';
// import { injected } from 'wagmi/connectors';
import hoodi_Logo from "@/assets/images/ethereum_Logo.png";
import ethereum_Logo from "@/assets/images/ethereum_Logo1.png";

const projectId = 'fba1325852fabad486bab619f8300d1c';

const hoodiTestnet = {
  id: 560048,
  name: 'Hoodi',
  iconUrl: hoodi_Logo,
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [
        'https://ttswap.io/hoodi',
        'https://rpc.hoodi.ethpandaops.io',
        'https://hoodi.drpc.org']
    },
  },
  blockExplorers: {
    default: {
      name: 'Hoodi Testnet Explorer',
      url: 'https://hoodi.etherscan.io',
      // apiUrl: 'https://hoodi.etherscan.io/api',
    },
  },
  // contracts: {
  //   multicall3: {
  //     address: '0xcA11bde05977b3631167028862bE2a173976CA11',
  //     blockCreated: 4584012,
  //   },
  // },
  testnet: true,
} as const satisfies Chain;

const ethereum = {
  id: 1,
  name: 'Ethereum',
  iconUrl: ethereum_Logo,
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        'https://ttswap.io/eth',
        'https://eth-mainnet.nodereal.io/v1/86983b52236c42449dfe843874949407',
        'https://rpc.ankr.com/eth',
        'https://1rpc.io/eth',
        'https://eth-mainnet.public.blastapi.io',
        'https://cloudflare-eth.com',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
      apiUrl: 'https://api.etherscan.io/api',
    },
  },
  contracts: {
    // ensRegistry: {
    //   address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    // },
    // ensUniversalResolver: {
    //   address: '0xce01f8eee7E479C928F8919abD53E553a36CeF67',
    //   blockCreated: 19_258_213,
    // },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14_353_601,
    },
  },
} as const satisfies Chain;

const ethereum01 = {
  id: 1,
  name: 'Ethereum',
  iconUrl: ethereum_Logo,
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        'https://ttswap.io/eth/read',
      ],
    },
  },
} as const satisfies Chain;

// Create a separate public client for read operations

export const readPublicClient = getDefaultConfig({
  appName: 'ttswap',
  projectId,
  chains: [
    ethereum01,
    hoodiTestnet
  ],
  transports: {
    [ethereum01.id]: http(),
    [hoodiTestnet.id]: http(),
  },
  ssr: true,
});

// Enable Smart Wallet and EOA
// Testing `preference` type
coinbaseWallet.preference = 'all';

export const config = getDefaultConfig({
  appName: 'ttswap',
  projectId,
  chains: [
    ethereum,
    hoodiTestnet
  ],
  wallets: [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        safeWallet,
        rainbowWallet,
        coinbaseWallet,
        walletConnectWallet,
      ],
    },
    {
      groupName: 'Other',
      wallets: [
        argentWallet,
        binanceWallet,
        uniswapWallet,
      ],
    },
  ],
  transports: {
    [ethereum.id]: http(),
    [hoodiTestnet.id]: http(),
  },
  ssr: true,
});

// export const publicClient = config.getClient().extend(publicActions);
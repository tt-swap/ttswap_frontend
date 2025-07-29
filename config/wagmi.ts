
import { type Chain, getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  argentWallet,
  bestWallet,
  bifrostWallet,
  binanceWallet,
  bitgetWallet,
  bitskiWallet,
  bitverseWallet,
  bloomWallet,
  bybitWallet,
  clvWallet,
  coin98Wallet,
  coinbaseWallet,
  compassWallet,
  coreWallet,
  dawnWallet,
  desigWallet,
  enkryptWallet,
  foxWallet,
  frameWallet,
  frontierWallet,
  gateWallet,
  imTokenWallet,
  iopayWallet,
  kaiaWallet,
  kaikasWallet,
  krakenWallet,
  kresusWallet,
  ledgerWallet,
  magicEdenWallet,
  metaMaskWallet,
  mewWallet,
  nestWallet,
  oktoWallet,
  okxWallet,
  omniWallet,
  oneInchWallet,
  oneKeyWallet,
  paraSwapWallet,
  phantomWallet,
  rabbyWallet,
  rainbowWallet,
  ramperWallet,
  roninWallet,
  safeWallet,
  safeheronWallet,
  safepalWallet,
  subWallet,
  tahoWallet,
  talismanWallet,
  tokenPocketWallet,
  tokenaryWallet,
  trustWallet,
  uniswapWallet,
  valoraWallet,
  walletConnectWallet,
  xdefiWallet,
  zealWallet,
  zerionWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { publicActions } from 'viem';
import {
  arbitrum,
  arbitrumSepolia,
  avalancheFuji,
  base,
  baseSepolia,
  blast,
  blastSepolia,
  bsc,
  bscTestnet,
  celo,
  celoAlfajores,
  flowMainnet,
  flowPreviewnet,
  flowTestnet,
  holesky,
  klaytn,
  klaytnBaobab,
  mainnet,
  mantle,
  mantleSepoliaTestnet,
  mantleTestnet,
  optimism,
  optimismSepolia,
  polygon,
  polygonMumbai,
  ronin,
  sepolia,
  zetachain,
  zetachainAthensTestnet,
  zksync,
  zora,
  zoraSepolia,
} from 'wagmi/chains';
import { http, createConfig } from 'wagmi';
import mantle_Logo from "assets/images/mantle_Logo.png";
import hoodi_Logo from "assets/images/ethereum_Logo.png";

const projectId = 'fba1325852fabad486bab619f8300d1c';

const avalanche = {
  id: 43_114,
  name: 'Avalanche',
  iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 11_907_934,
    },
  },
} as const satisfies Chain;

const sei = {
  id: 713715,
  name: 'Sei',
  iconUrl:
    'https://s3.coinmarketcap.com/static-gravity/image/992744cfbd5e40f5920018ee7a830b98.png',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Sei', symbol: 'SEI', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://evm-rpc.arctic-1.seinetwork.io'] },
  },
  blockExplorers: {
    default: { name: 'Sei Explorer', url: 'https://www.seiscan.app' },
  },
  contracts: {},
} as const satisfies Chain;

const mantleSepolia = {
  id: 5003,
  name: 'Mantle Sepolia',
  iconUrl: mantle_Logo.src,
  nativeCurrency: {
    decimals: 18,
    name: 'MNT',
    symbol: 'MNT',
  },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia.mantle.xyz'] },
  },
  blockExplorers: {
    default: {
      name: 'Mantle Testnet Explorer',
      url: 'https://explorer.sepolia.mantle.xyz/',
      apiUrl: 'https://explorer.sepolia.mantle.xyz/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 4584012,
    },
  },
  testnet: true,
} as const satisfies Chain;

const hoodiTestnet = {
  id: 560048,
  name: 'Hoodi Testnet',
  iconUrl: hoodi_Logo.src,
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://hoodi.drpc.org'] },
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
  iconUrl: hoodi_Logo.src,
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        'https://ttswap.io/eth',
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
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensUniversalResolver: {
      address: '0xce01f8eee7E479C928F8919abD53E553a36CeF67',
      blockCreated: 19_258_213,
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14_353_601,
    },
  },
} as const satisfies Chain;


// Enable Smart Wallet and EOA
// Testing `preference` type
coinbaseWallet.preference = 'all';

export const config = getDefaultConfig({
  appName: 'ttswap',
  projectId,
  chains: [
    ethereum,
    // sepolia,
    // mainnet,
    // arbitrum,
    // polygon,
    // optimism,
    // base,
    // bsc,
    // bscTestnet,
    // avalanche,
    // zora,
    // blast,
    // zksync,
    // zetachain,
    // ronin,
    // klaytn,
    // sei,
    // mantle,
    // celo,
    // flowMainnet,
    // flowPreviewnet,
    // flowTestnet,
    // mantle,
    // mantleSepolia,
    // mantleTestnet,
    // hoodiTestnet
  ],
  wallets: [
    {
      groupName: 'Popular',
      wallets: [
        safeWallet,
        rainbowWallet,
        coinbaseWallet,
        metaMaskWallet,
        walletConnectWallet,
      ],
    },
    {
      groupName: 'Other',
      wallets: [
        argentWallet,
        binanceWallet,
        uniswapWallet,
        // bestWallet,
        // bifrostWallet,
        // bitgetWallet,
        // bitskiWallet,
        // bitverseWallet,
        // bloomWallet,
        // bybitWallet,
        // clvWallet,
        // coin98Wallet,
        // compassWallet,
        // coreWallet,
        // dawnWallet,
        // desigWallet,
        // enkryptWallet,
        // foxWallet,
        // frameWallet,
        // frontierWallet,
        // gateWallet,
        // imTokenWallet,
        // iopayWallet,
        // kaiaWallet,
        // kaikasWallet,
        // krakenWallet,
        // kresusWallet,
        // ledgerWallet,
        // magicEdenWallet,
        // mewWallet,
        // nestWallet,
        // oktoWallet,
        // okxWallet,
        // omniWallet,
        // oneInchWallet,
        // oneKeyWallet,
        // paraSwapWallet,
        // phantomWallet,
        // rabbyWallet,
        // ramperWallet,
        // roninWallet,
        // safeheronWallet,
        // safepalWallet,
        // subWallet,
        // tahoWallet,
        // talismanWallet,
        // tokenPocketWallet,
        // tokenaryWallet,
        // trustWallet,
        // valoraWallet,
        // xdefiWallet,
        // zealWallet,
        // zerionWallet,
      ],
    },
  ],
  transports: {
    [ethereum.id]: http(),
    // [sepolia.id]: http(),
    [hoodiTestnet.id]: http(),
    // [mantleSepoliaTestnet.id]: http(),
    // [mantleTestnet.id]: http(),
    // [mainnet.id]: http(),
    // [arbitrum.id]: http(),
    // [bscTestnet.id]: http(),
  },
  ssr: true,
});

export const publicClient = config.getClient().extend(publicActions);
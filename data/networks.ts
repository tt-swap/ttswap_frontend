import type { AddEthereumChainParameter } from "@web3-react/types";

const infuraKey = process.env.REACT_APP_INFURA_KEY;
const alchemyKey = infuraKey;
const groveAppId = process.env.REACT_APP_GROVE_APPID;

const ETH: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Ether",
  symbol: "ETH",
  decimals: 18
};

const MATIC: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Matic",
  symbol: "MATIC",
  decimals: 18
};

const FTM: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Fantom",
  symbol: "FTM",
  decimals: 18
};

const BNB: AddEthereumChainParameter["nativeCurrency"] = {
  name: "BNB Chain",
  symbol: "BNB",
  decimals: 18
};

interface BasicChainInformation {
  chainId: string;
  urls: string[];
  publicUrls: string[];
  name: string;
  chainName: string;
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter["nativeCurrency"];
  blockExplorerUrls: AddEthereumChainParameter["blockExplorerUrls"];
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation)?.nativeCurrency;
}

export function getAddChainParameters(chainId: number): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId];
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.chainName,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.publicUrls,
      blockExplorerUrls: chainInformation.blockExplorerUrls
    };
  } else {
    return chainId;
  }
}

export const getNativeByChain = (chainId: number): string | undefined => {
  const chainInformation = CHAINS[chainId];
  if (isExtendedChainInformation(chainInformation)) return chainInformation.nativeCurrency.symbol;
  return undefined;
};

export const getExplorer = (chainId: number): string[] | undefined => {
  const chainInformation = CHAINS[chainId];
  if (isExtendedChainInformation(chainInformation)) return chainInformation.blockExplorerUrls;
  return undefined;
};

export const getChainName = (chainId: number): string | undefined => {
  const chainInformation = CHAINS[chainId];
  if (isExtendedChainInformation(chainInformation)) return chainInformation.chainName;
  return undefined;
};

export const CHAINS: {
  [chainId: number]: BasicChainInformation | ExtendedChainInformation;
} = {
  1: {
    chainId: "1",
    urls: [
      infuraKey ? `https://mainnet.infura.io/v3/${infuraKey}` : "",
      alchemyKey ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}` : "",
      groveAppId ? `https://eth-mainnet.rpc.grove.city/v1/${groveAppId}` : "",
      "https://rpc.ankr.com/eth",
      "https://cloudflare-eth.com"
    ].filter(Boolean),
    publicUrls: ["https://rpc.ankr.com/eth"].filter(Boolean),
    name: "Mainnet",
    chainName:"ethereum",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://etherscan.io"]
  },
  11155111: {
    chainId: "11155111",
    urls: [
      infuraKey ? `https://sepolia.infura.io/v3/${infuraKey}` : "",
      alchemyKey ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}` : "",
      groveAppId ? `https://sepolia.rpc.grove.city/v1/${groveAppId}` : ""
    ].filter(Boolean),
    publicUrls: ["https://sepolia.infura.io/v3/", "https://rpc.sepolia.org"].filter(Boolean),
    name: "Sepolia",
    chainName:"sepolia",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://sepolia.etherscan.io"]
  },
  // Optimism
  10: {
    chainId: "10",
    urls: [
      infuraKey ? `https://optimism-mainnet.infura.io/v3/${infuraKey}` : "",
      alchemyKey ? `https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}` : "",
      "https://mainnet.optimism.io"
    ].filter(Boolean),
    publicUrls: ["https://mainnet.optimism.io"].filter(Boolean),
    name: "OP Mainnet",
    chainName:"optimism",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://optimistic.etherscan.io"]
  },
  420: {
    chainId: "420",
    urls: [
      infuraKey ? `https://optimism-goerli.infura.io/v3/${infuraKey}` : "",
      alchemyKey ? `https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}` : "",
      "https://goerli.optimism.io"
    ].filter(Boolean),
    publicUrls: ["https://goerli.optimism.io"].filter(Boolean),
    name: "Optimism Goerli",
    chainName:"optimismgoerli",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://goerli-explorer.optimism.io"]
  },
  // Arbitrum
  42161: {
    chainId: "42161",
    urls: [
      infuraKey ? `https://arbitrum-mainnet.infura.io/v3/${infuraKey}` : "",
      alchemyKey ? `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}` : "",
      "https://arb1.arbitrum.io/rpc"
    ].filter(Boolean),
    publicUrls: ["https://arb1.arbitrum.io/rpc"].filter(Boolean),
    name: "Arbitrum One",
    chainName:"arbitrum",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://arbiscan.io"]
  },
  421614: {
    chainId: "421614",
    urls: [
      infuraKey ? `https://arbitrum-sepolia.infura.io/v3/${infuraKey}` : "",
      alchemyKey ? `https://arb-sepolia.g.alchemy.com/v2/${alchemyKey}` : "",
      "https://sepolia-rollup.arbitrum.io/rpc"
    ].filter(Boolean),
    publicUrls: ["https://sepolia-rollup.arbitrum.io/rpc"].filter(Boolean),
    name: "Arbitrum Sepolia",
    chainName:"arbitrumsepolia",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://sepolia.arbiscan.io/"]
  },
  // Polygon
  137: {
    chainId: "137",
    urls: [
      infuraKey ? `https://polygon-mainnet.infura.io/v3/${infuraKey}` : "",
      alchemyKey ? `https://polygon-mainnet.g.alchemy.com/v2/${alchemyKey}` : "",
      groveAppId ? `https://poly-mainnet.rpc.grove.city/v1/${groveAppId}` : "",
      "https://polygon-rpc.com"
    ].filter(Boolean),
    publicUrls: ["https://polygon-rpc.com"].filter(Boolean),
    name: "Polygon",
    chainName:"polygon",
    nativeCurrency: MATIC,
    blockExplorerUrls: ["https://polygonscan.com"]
  },
  80001: {
    chainId: "80001",
    urls: [
      infuraKey ? `https://polygon-mumbai.infura.io/v3/${infuraKey}` : "",
      alchemyKey ? `https://polygon-mumbai.g.alchemy.com/v2/${alchemyKey}` : "",
      "https://rpc-mumbai.maticvigil.com"
    ].filter(Boolean),
    publicUrls: ["https://rpc-mumbai.maticvigil.com"].filter(Boolean),
    name: "Polygon Mumbai",
    chainName:"polygonmumbai",
    nativeCurrency: MATIC,
    blockExplorerUrls: ["https://mumbai.polygonscan.com"]
  },
  // zkSync
  324: {
    chainId: "324",
    urls: [
      alchemyKey ? `https://polygonzkevm-mainnet.g.alchemy.com/v2/${alchemyKey}` : "",
      "https://mainnet.era.zksync.io"
    ].filter(Boolean),
    publicUrls: ["https://mainnet.era.zksync.io"].filter(Boolean),
    name: "zkSync Era",
    chainName:"zksync",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://explorer.zksync.io"]
  },
  280: {
    chainId: "280",
    urls: [
      alchemyKey ? `https://polygonzkevm-testnet.g.alchemy.com/v2/${alchemyKey}` : "",
      "https://testnet.era.zksync.dev"
    ].filter(Boolean),
    publicUrls: ["https://testnet.era.zksync.dev"].filter(Boolean),
    name: "zkSync Era Testnet",
    chainName:"zksyncgoerli",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://goerli.explorer.zksync.io"]
  },
  // Fantom
  250: {
    chainId: "250",
    urls: [
      infuraKey ? `https://fantom-mainnet.rpc.grove.city/v1/${groveAppId}` : "",
      "https://rpc.ankr.com/fantom"
    ].filter(Boolean),
    publicUrls: ["https://rpc.ankr.com/fantom"].filter(Boolean),
    name: "Fantom",
    chainName:"fantom",
    nativeCurrency: FTM,
    blockExplorerUrls: ["https://ftmscan.com/"]
  },
  4002: {
    chainId: "4002",
    urls: ["https://rpc.testnet.fantom.network"].filter(Boolean),
    publicUrls: ["https://rpc.testnet.fantom.network"].filter(Boolean),
    name: "Fantom Testnet",
    chainName:"fantomtest",
    nativeCurrency: FTM,
    blockExplorerUrls: ["https://testnet.ftmscan.com/"]
  },
  // BSC
  56: {
    chainId: "56",
    urls: [
      groveAppId ? `https://bsc-mainnet.rpc.grove.city/v1/${groveAppId}` : "",
      "https://bsc-dataseed.binance.org/",
      "https://rpc.ankr.com/bsc"
    ].filter(Boolean),
    publicUrls: ["https://rpc.ankr.com/bsc"].filter(Boolean),
    name: "BNB Smart Chain",
    chainName:"binance",
    nativeCurrency: BNB,
    blockExplorerUrls: ["https://bscscan.com/"]
  },
  97: {
    chainId: "97",
    urls: ["https://data-seed-prebsc-1-s1.binance.org:8545/", "https://data-seed-prebsc-1-s3.binance.org:8545/"].filter(
      Boolean
    ),
    publicUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"].filter(Boolean),
    name: "BSC Testnet",
    chainName:"binancetestnet",
    nativeCurrency: BNB,
    blockExplorerUrls: ["https://testnet.bscscan.com/"]
  }
};

export const URLS: { [chainId: number]: string[] } = Object.keys(CHAINS).reduce<{ [chainId: number]: string[] }>(
  (accumulator, chainId) => {
    const validURLs: string[] = CHAINS[Number(chainId)].urls;

    if (validURLs.length) {
      accumulator[Number(chainId)] = validURLs;
    }

    return accumulator;
  },
  {}
);

export const CHAINIDs: { [chainId: number]: string } = Object.keys(CHAINS).reduce<{ [chainId: number]: string }>(
  (accumulator, chainId) => {
    const validCHAINIDs: string = CHAINS[Number(chainId)].chainId;

    if (validCHAINIDs) {
      accumulator[Number(chainId)] = validCHAINIDs;
    }

    return accumulator;
  },
  {}
);


import contractConfig from "@/public/config/contractConfig.json"
interface BasicChainInformation {
  chainId: string;
  contractAddress: string;
  theGraphApi: string;
  permit2Address: string;
}

export const getContractAddress = (chainId: number): string => {
  // alert(chainId)
  const chainInformation = contractCon[chainId];
  return chainInformation.contractAddress;
};
export const getPermit2PAddress = (chainId: number): string => {
  // alert(chainId)
  const chainInformation = contractCon[chainId];
  return chainInformation.permit2Address;
};

export const getTheGraphApi = (chainId: number): string => {
  const chainInformation = contractCon[chainId];
  // console.log(chainId,1010101,chainInformation.theGraphApi)
  return chainInformation.theGraphApi;
};

export const contractCon: {
  [chainId: number]: BasicChainInformation;
} = {
  1: {
    chainId: "1",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  },
  11155111: {
    chainId: "11155111",
    contractAddress: "0xf4d05B5D35E59Ef5B6988da7234cEf339ee796bc",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest",
    permit2Address:"0x419C606ed7dd9e411826A26CE9F146ed5A5F7C34"
  },
  // Optimism
  10: {
    chainId: "10",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  },
  420: {
    chainId: "420",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  },
  // Arbitrum
  42161: {
    chainId: "42161",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  },
  421614: {
    chainId: "421614",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  },
  // Polygon
  137: {
    chainId: "137",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  },
  80001: {
    chainId: "80001",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  },
  // zkSync
  324: {
    chainId: "324",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  },
  280: {
    chainId: "280",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  },
  // Fantom
  250: {
    chainId: "250",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  },
  4002: {
    chainId: "4002",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  },
  // BSC
  56: {
    chainId: "56",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  },
  97: {
    chainId: "97",
    contractAddress: "0xa50eb0d081E986c280efF32dae089939Ea07bd22",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap_bnb/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  },
  747: {
    chainId: "747",
    contractAddress: "0xa50eb0d081E986c280efF32dae089939Ea07bd22",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap_bnb/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  },
  646: {
    chainId: "646",
    contractAddress: "0xa50eb0d081E986c280efF32dae089939Ea07bd22",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap_bnb/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  },
  545: {
    chainId: "545",
    contractAddress: "0xa50eb0d081E986c280efF32dae089939Ea07bd22",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap_bnb/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  },
  5000: {
    chainId: "5000",
    contractAddress: "0xa50eb0d081E986c280efF32dae089939Ea07bd22",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap_bnb/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  },
  5003: {
    chainId: "5003",
    contractAddress: "0x4A639A276910ECD78370B32BDC92278e032Dbb21",
    theGraphApi: "https://subgraph-api.mantle.xyz/api/public/200e5831-7db0-4aa7-9c64-aceb9ac35caa/subgraphs/ttswap/v0.0.26/gn",
    permit2Address:"0x9588F74Df5BbC1CD3a45720Cb944A4b1048A4450"
  },
  5001: {
    chainId: "5001",
    contractAddress: "0x4A639A276910ECD78370B32BDC92278e032Dbb21",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap-v1/version/latest",
    permit2Address:"0xC564c491EF1639C83b6F721374b5531ba6A1EcEb"
  }
};

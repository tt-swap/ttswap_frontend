
interface BasicChainInformation {
  chainId: string;
  contractAddress: string;
  theGraphApi: string;
}

export const getContractAddress = (chainId: number): string => {
  const chainInformation = contractCon[chainId];
  return chainInformation.contractAddress;
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
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest"
  },
  11155111: {
    chainId: "11155111",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest"
  },
  // Optimism
  10: {
    chainId: "10",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest"
  },
  420: {
    chainId: "420",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest"
  },
  // Arbitrum
  42161: {
    chainId: "42161",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest"
  },
  421614: {
    chainId: "421614",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest"
  },
  // Polygon
  137: {
    chainId: "137",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest"
  },
  80001: {
    chainId: "80001",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest"
  },
  // zkSync
  324: {
    chainId: "324",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest"
  },
  280: {
    chainId: "280",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest"
  },
  // Fantom
  250: {
    chainId: "250",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest"
  },
  4002: {
    chainId: "4002",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest"
  },
  // BSC
  56: {
    chainId: "56",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest"
  },
  97: {
    chainId: "97",
    contractAddress: "0xa50eb0d081E986c280efF32dae089939Ea07bd22",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap_bnb/version/latest"
  }
};

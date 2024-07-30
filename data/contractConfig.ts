
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
  console.log(chainInformation)
  return chainInformation.theGraphApi;
};

export const contractCon: {
  [chainId: number]: BasicChainInformation;
} = {
  1: {
    chainId: "1",
    contractAddress: "",
    theGraphApi: ""
  },
  11155111: {
    chainId: "11155111",
    contractAddress: "0xC564c491EF1639C83b6F721374b5531ba6A1EcEb",
    theGraphApi: "https://api.studio.thegraph.com/query/57827/ttswap/version/latest"
  },
  // Optimism
  10: {
    chainId: "10",
    contractAddress: "",
    theGraphApi: ""
  },
  420: {
    chainId: "420",
    contractAddress: "",
    theGraphApi: ""
  },
  // Arbitrum
  42161: {
    chainId: "42161",
    contractAddress: "",
    theGraphApi: ""
  },
  421614: {
    chainId: "421614",
    contractAddress: "",
    theGraphApi: ""
  },
  // Polygon
  137: {
    chainId: "137",
    contractAddress: "",
    theGraphApi: ""
  },
  80001: {
    chainId: "80001",
    contractAddress: "",
    theGraphApi: ""
  },
  // zkSync
  324: {
    chainId: "324",
    contractAddress: "",
    theGraphApi: ""
  },
  280: {
    chainId: "280",
    contractAddress: "",
    theGraphApi: ""
  },
  // Fantom
  250: {
    chainId: "250",
    contractAddress: "",
    theGraphApi: ""
  },
  4002: {
    chainId: "4002",
    contractAddress: "",
    theGraphApi: ""
  },
  // BSC
  56: {
    chainId: "56",
    contractAddress: "",
    theGraphApi: ""
  },
  97: {
    chainId: "97",
    contractAddress: "",
    theGraphApi: ""
  }
};

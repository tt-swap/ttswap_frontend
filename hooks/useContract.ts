import { useMemo } from "react";

import { AddressZero } from "@ethersproject/constants";
import { Provider } from "@ethersproject/providers";
import { Contract, ContractInterface, Signer } from "ethers";
import { isAddress } from "ethers";

import { useSignerOrProvider } from "./useSignerOrProvider";

function getContract<T = Contract>(address: string, abi: ContractInterface, provider: Signer | Provider) {
  return <T>(<unknown>new Contract(address, abi, provider));
}

// heavily inspired by uniswaps interface, thanks Noah, great work!
export function useContract<Contract>(address: string, abi: ContractInterface) {
  const { provider, signer } = useSignerOrProvider();
  const signerOrProvider = signer ?? provider;

  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  const contract = signerOrProvider
    ? useMemo(() => getContract<Contract>(address, abi, signerOrProvider), [address, abi, signerOrProvider])
    : undefined;

  return contract;
}

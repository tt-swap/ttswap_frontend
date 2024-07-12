import { useMemo } from "react";

import type { Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import type { Signer } from "ethers";

interface SignerOrProvider {
  provider: Provider | undefined;
  signer: Signer | undefined;
}

export const useSignerOrProvider = (): SignerOrProvider => {
  const { provider, account } = useWeb3React();
// @ts-ignore
  return useMemo(() => {
    let signer;
    if (provider?.getSigner) {
      signer = provider.getSigner(account);
    }

    return { provider, signer };
  }, [provider]);
};

import { useEffect, useState } from "react";

import type { Web3ReactHooks } from "@web3-react/core";

export const useNativeBalance = (
  provider?: ReturnType<Web3ReactHooks["useProvider"]>,
  account?: string
): BigInt | undefined => {
  const [balance, setBalance] = useState<BigInt | undefined>();

  useEffect(() => {
    if (provider && account?.length) {
      const fetchBalance = async (account: string) => {// @ts-ignore
        const res: BigInt | undefined = await provider?.getBalance(account);
        setBalance(res);
      };

      fetchBalance(account);
    }
  }, [provider, account]);

  return balance;
};

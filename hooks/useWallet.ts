import { TOKENS } from "@/shared/constants/tokens";
import { MOCK_BALANCE } from "@/shared/constants/wallet";
import { Balance } from "@/shared/types/balance";
import { useMemo } from "react";

const useWallet = () => {
  const balanceMap = useMemo<Record<string, Balance>>(() => {
    return MOCK_BALANCE.reduce((aggregate, element) => {
      aggregate[element.currency.toUpperCase()] = element;
      return aggregate;
    }, {} as Record<string, Balance>);
  }, []);

  return { tokens: TOKENS, balanceMap };
};

export default useWallet;

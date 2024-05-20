import { TOKENS } from "@/shared/constants/tokens";
import { Token } from "@/shared/types/token";
import { useMemo } from "react";

const useTokens = () => {
  const tokenMap = useMemo<Record<string, Token>>(() => {
    return TOKENS.reduce((aggregate, element) => {
      aggregate[element.currency.toUpperCase()] = element;
      return aggregate;
    }, {} as Record<string, Token>);
  }, []);


  return { tokens: TOKENS, tokenMap };
};

export default useTokens;

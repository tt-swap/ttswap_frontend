import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { Price } from "@/shared/types/price";
import { useBlockChainPriceStore } from "@/stores/prices";
import React from "react";

const usePrices = () => {
  const { isFetching, prices, getPrices } = useBlockChainPriceStore();

  const pricesMap = React.useMemo<Record<string, Price>>(() => {
    return prices.reduce((aggregate, element) => {
      aggregate[element.currency.toUpperCase()] = element;
      return aggregate;
    }, {} as Record<string, Price>);
  }, [prices]);

  const estimate = ({
    from,
    to,
    amount,
  }: {
    from: string;
    to: string;
    amount: number;
  }):number => {
    if (from === DEFAULT_TOKEN || to === DEFAULT_TOKEN) {
      return 0;
    }

    const priceFrom = pricesMap[from.toUpperCase()].price;
    const priceTo = pricesMap[to.toUpperCase()].price;
    const price = (priceFrom * amount) / priceTo;
    return price > 0 ? +price.toFixed(5) : 0;
  };
  return { isFetching, prices, pricesMap, getPrices, estimate };
};

export default usePrices;

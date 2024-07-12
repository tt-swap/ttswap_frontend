import { useInvestStore, useInvestAmountStore } from "@/stores/invest";
import { SwapKeys } from "@/shared/enums/tokens";
import { useMemo, useState } from "react";
import { DEFAULT_TOKEN } from "@/shared/constants/common";

const useInvest = () => {
  const { invest, setInvest } = useInvestStore();
  const { investAmount, setInvestAmount } = useInvestAmountStore();

  const setToken = (element: string, value: any) => {
    // console.log(element, "******", value, invest)
    if (value) {

      if (element === SwapKeys.From) {
        setInvest({
          from: {
            id: value.id,
            symbol: value.symbol,
            name: value.name,
            investFee: value.investFee,
            price: value.price,
            logo_url: value.logo_url,
            address: value.address,
            isvaluegood: value.isvaluegood,
            decimals: value.decimals,
          },
          to: {
            id: invest.to.id,
            symbol: invest.to.symbol,
            name: invest.to.name,
            investFee: invest.to.investFee,
            price: invest.to.price,
            logo_url: invest.to.logo_url,
            address: invest.to.address,
            isvaluegood: invest.to.isvaluegood,
            decimals: invest.to.decimals,
          },
        });
      } else {
        setInvest({
          from: {
            id: invest.from.id,
            symbol: invest.from.symbol,
            name: invest.from.name,
            investFee: invest.from.investFee,
            price: invest.from.price,
            logo_url: invest.from.logo_url,
            address: invest.from.address,
            isvaluegood: invest.from.isvaluegood,
            decimals: invest.from.decimals,
          },
          to: {
            id: value.id,
            symbol: value.symbol,
            name: value.name,
            investFee: value.investFee,
            price: value.price,
            logo_url: value.logo_url,
            address: value.address,
            isvaluegood: value.isvaluegood,
            decimals: value.decimals,
          },
        });
      }
    }
  };

  const setAmount = (element: string, value: number | '' | null) => {
    let num;
    if (value === '' || value === null || value < 0) value = 0;
    if (element === SwapKeys.From) {
      num = invest.from.price / invest.to.price * value;
      setInvestAmount({
        from: {
          token: invest.from.symbol,
          amount: value,
          id: invest.from.id
        },
        to: {
          token: invest.to.symbol,
          amount: Number(num.toFixed(6)),
          id: invest.to.id
        },
      });
    } else {
      num = invest.to.price / invest.from.price * value;
      setInvestAmount({
        from: {
          token: invest.from.symbol,
          amount: Number(num.toFixed(6)),
          id: invest.from.id
        },
        to: {
          token: invest.to.symbol,
          amount: value,
          id: invest.to.id
        },
      });
    }
  };

  const swapArray = Object.keys(invest) as Array<SwapKeys>;

  const fromPrice = useMemo(() => {
    if (investAmount.from.amount && invest.from.symbol !== DEFAULT_TOKEN) {
      const price =
        investAmount.from.amount * invest.from.price * (1 - invest.from.investFee);

      return price > 0 ? Number(price.toFixed(6)) : 0;
    }
    return 0;
  }, [invest, investAmount]);

  const toPrice = useMemo(() => {
    if (investAmount.to.amount && invest.to.symbol !== DEFAULT_TOKEN) {
      const price =
        investAmount.to.amount * invest.to.price * (1 - invest.to.investFee);

      return price > 0 ? Number(price.toFixed(6)) : 0;
    }
    return 0;
  }, [invest, investAmount]);


  const disabled = useMemo(() => {
    return (
      invest.from.symbol === DEFAULT_TOKEN ||
      // invest.to.symbol === DEFAULT_TOKEN ||
      investAmount.from.amount === 0 ||
      localStorage.getItem("wallet") === null
    );
  }, [invest, investAmount, localStorage.getItem("wallet")]);

  return {
    invest,
    investAmount,
    setAmount,
    setToken,
    fromPrice,
    toPrice,
    disabled,
  };
};

export default useInvest
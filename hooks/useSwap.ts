import { useSwapStore } from "@/stores/swap";
import usePrices from "./usePrices";
import { SwapKeys } from "@/shared/enums/tokens";
import { useMemo } from "react";
import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { toast } from "react-toastify";

const useSwap = () => {
  const { swaps, setSwap } = useSwapStore();
  const { pricesMap, estimate } = usePrices();

  const setToken = (element: SwapKeys, value: string) => {
    if (element === SwapKeys.From) {
      const estimation = estimate({
        from: swaps.to.token,
        to: value,
        amount: swaps.to.amount,
      });
      setSwap({
        from: { token: value, amount: estimation },
        to: { token: swaps.to.token, amount: swaps.to.amount },
      });
    } else {
      const estimation = estimate({
        from: swaps.from.token,
        to: value,
        amount: swaps.from.amount,
      });
      setSwap({
        from: { token: swaps.from.token, amount: swaps.from.amount },
        to: { token: value, amount: estimation },
      });
    }
  };

  const setAmount = (element: SwapKeys, value: number) => {
    if (element === SwapKeys.From) {
      const estimation = estimate({
        from: swaps.from.token,
        to: swaps.to.token,
        amount: value,
      });
      setSwap({
        from: { token: swaps.from.token, amount: value },
        to: { token: swaps.to.token, amount: estimation },
      });
    } else {
      const estimation = estimate({
        from: swaps.to.token,
        to: swaps.from.token,
        amount: value,
      });
      setSwap({
        from: { token: swaps.from.token, amount: estimation },
        to: { token: swaps.to.token, amount: value },
      });
    }
  };

  const handleSwap = () => {
    setSwap({
      from: { token: swaps.from.token, amount: 0 },
      to: { token: swaps.to.token, amount: 0 },
    });

    toast.success('Token swapped successfully')
  };

  const handleFlip = () => {
    const estimation = estimate({
      from: swaps.to.token,
      to: swaps.from.token,
      amount: swaps.to.amount,
    });

    setSwap({
      from: {
        token: swaps.to.token,
        amount: swaps.to.amount,
      },
      to: {
        token: swaps.from.token,
        amount: estimation,
      },
    });
  };

  const swapArray = Object.keys(swaps) as Array<SwapKeys>;

  const computedPrice = useMemo(() => {
    const price =
      swaps.from.amount *
      ((pricesMap[swaps.from.token] && pricesMap[swaps.from.token].price) || 0);

    return price > 0 ? price.toFixed(5) : 0;
  }, [swaps]);

  const disabled = useMemo(() => {
    return (
      swaps.from.token === DEFAULT_TOKEN ||
      swaps.to.token === DEFAULT_TOKEN ||
      swaps.from.amount === 0
    );
  }, [swaps]);

  return {
    swaps,
    setAmount,
    handleFlip,
    handleSwap,
    setToken,
    swapArray,
    computedPrice,
    disabled,
  };
};

export default useSwap
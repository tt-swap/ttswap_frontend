import { useSwapStore } from "@/stores/swap";
import { useSwapAmountStore } from "@/stores/swapAmount";
import usePrices from "./usePrices";
import { SwapKeys } from "@/shared/enums/tokens";
import { useMemo, useState } from "react";
import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { toast } from "react-toastify";

const useSwap = () => {
  const { swaps, setSwap } = useSwapStore();
  const { pricesMap, estimate } = usePrices();
  const { swapsAmount, setSwapAmount } = useSwapAmountStore();
  const [ focus, setFocus ] = useState("from");

  const setToken = (element: string, value: any) => {
    console.log(element, "******", value, swaps)

    if (element === SwapKeys.From) {
      if (swaps.to.id === value.id) {
        handleFlip();
        return;
      }
      setSwap({
        from: {
          id: value.id,
          symbol: value.symbol,
          buyFee: value.buyFee,
          sellFee: value.sellFee,
          price: value.price,
          logo_url: value.logo_url,
          address: value.address,
          currentQuantity: value.currentQuantity,
          currentValue: value.currentValue,
        },
        to: {
          id: swaps.to.id,
          symbol: swaps.to.symbol,
          buyFee: swaps.to.buyFee,
          sellFee: swaps.to.sellFee,
          price: swaps.to.price,
          logo_url: swaps.to.logo_url,
          address: swaps.to.address,
          currentQuantity: swaps.to.currentQuantity,
          currentValue: swaps.to.currentValue,
        },
      });
    } else {
      if (swaps.from.id === value.id) {
        handleFlip();
        return;
      }
      setSwap({
        from: {
          id: swaps.from.id,
          symbol: swaps.from.symbol,
          buyFee: swaps.from.buyFee,
          sellFee: swaps.from.sellFee,
          price: swaps.from.price,
          logo_url: swaps.from.logo_url,
          address: swaps.from.address,
          currentQuantity: swaps.from.currentQuantity,
          currentValue: swaps.from.currentValue,
        },
        to: {
          id: value.id,
          symbol: value.symbol,
          buyFee: value.buyFee,
          sellFee: value.sellFee,
          price: value.price,
          logo_url: value.logo_url,
          address: value.address,
          currentQuantity: value.currentQuantity,
          currentValue: value.currentValue,
        },
      });
    }
    console.log(element, "#######", value, swaps)

  };

  const setAmount = (element: string, value: number) => {
    let num;
    if (element === SwapKeys.From) {
      num = swaps.from.price /swaps.to.price*value*(1-swaps.to.buyFee);
      setSwapAmount({
        from: {
          token: swaps.from.symbol,
          amount: value,
          id: swaps.from.id
        },
        to: {
          token: swaps.to.symbol,
          amount: num.toFixed(6),
          id: swaps.to.id
        },
      });
    } else {
      num = swaps.to.price /swaps.from.price*value;
      setSwapAmount({
        from: {
          token: swaps.from.symbol,
          amount: num.toFixed(6),
          id: swaps.from.id
        },
        to: {
          token: swaps.to.symbol,
          amount: value,
          id: swaps.to.id
        },
      });
    }
  };

  const handleSwap = () => {
    // setSwap({
    //   from: { token: swaps.from.token, amount: 0 },
    //   to: { token: swaps.to.token, amount: 0 },
    // });

    toast.success('Token swapped successfully')
  };

  const handleFlip = () => {
    setSwap({
      from: {
        id: swaps.to.id,
        symbol: swaps.to.symbol,
        buyFee: swaps.to.buyFee,
        sellFee: swaps.to.sellFee,
        price: swaps.to.price,
        logo_url: swaps.to.logo_url,
        address: swaps.to.address,
        currentQuantity: swaps.to.currentQuantity,
        currentValue: swaps.to.currentValue,
      },
      to: {
        id: swaps.from.id,
        symbol: swaps.from.symbol,
        buyFee: swaps.from.buyFee,
        sellFee: swaps.from.sellFee,
        price: swaps.from.price,
        logo_url: swaps.from.logo_url,
        address: swaps.from.address,
        currentQuantity: swaps.from.currentQuantity,
        currentValue: swaps.from.currentValue,
      },
    });
    let value:number;
    let num;
    if (focus === SwapKeys.From) {
      value = swapsAmount.from.amount;
      num = swaps.from.price /swaps.to.price*value;
      setSwapAmount({
        from: {
          token: swaps.to.symbol,
          amount: num.toFixed(6),
          id: swaps.to.id
        },
        to: {
          token: swaps.from.symbol,
          amount: value,
          id: swaps.from.id
        },
      });
    } else {
      value = swapsAmount.to.amount;
      num = swaps.to.price /swaps.from.price*value*(1-swaps.from.sellFee);
      setSwapAmount({
        from: {
          token: swaps.to.symbol,
          amount: value,
          id: swaps.to.id
        },
        to: {
          token: swaps.from.symbol,
          amount: num.toFixed(6),
          id: swaps.from.id
        },
      });
    }
  };

  const swapArray = Object.keys(swaps) as Array<SwapKeys>;

  const fromPrice = useMemo(() => {
    if (swapsAmount.from.amount && swaps.from.symbol !== DEFAULT_TOKEN) {
      const price =
      swapsAmount.from.amount * swaps.from.price * (1-swaps.from.sellFee);
  
      return price > 0 ? price.toFixed(6) : 0;
    }
  }, [swaps,swapsAmount]);

  const toPrice = useMemo(() => {
    if (swapsAmount.to.amount && swaps.to.symbol !== DEFAULT_TOKEN) {
      const price =
      swapsAmount.to.amount * swaps.to.price;
  
      return price > 0 ? price.toFixed(6) : 0;
    }
  }, [swaps,swapsAmount]);

  const priceImpact = useMemo(() => {
    if (swapsAmount.to.amount !=='' && swapsAmount.from.amount !=='' && swaps.to.symbol !== DEFAULT_TOKEN) {
      const priceF = swaps.from.currentValue/swaps.from.currentQuantity;
      const priceT = swaps.to.currentValue/swaps.to.currentQuantity;
      const ncvf = priceF*swapsAmount.from.amount*1;
      const ncvt = priceT*swapsAmount.to.amount*1;
      const priceFN = (swaps.from.currentValue-ncvf)/(swaps.from.currentQuantity+swapsAmount.from.amount*1);
      const priceTN = (swaps.to.currentValue+ncvt)/(swaps.to.currentQuantity-swapsAmount.to.amount*1);
      const initial = priceF/priceT;
      const newP = priceFN/priceTN;
      const ippact = (newP-initial)/initial*100
      // console.log(ippact,1111)
      return ippact.toFixed(2);
    }
  }, [swapsAmount.to.amount]);

  const disabled = useMemo(() => {
    return (
      swaps.from.symbol === DEFAULT_TOKEN ||
      swaps.to.symbol === DEFAULT_TOKEN ||
      swapsAmount.from.amount === 0 
    );
  }, [swaps, swapsAmount]);

  return {
    swaps,
    swapsAmount,
    priceImpact,
    setAmount,
    handleFlip,
    handleSwap,
    setToken,
    setFocus,
    swapArray,
    fromPrice,
    toPrice,
    disabled,
  };
};

export default useSwap
import { useSwapStore } from "@/stores/swap";
import { useSwapAmountStore } from "@/stores/swapAmount";
import { SwapKeys } from "@/shared/enums/tokens";
import { useMemo, useState } from "react";
import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { toast } from "react-toastify";

const useSwap = () => {
    const { swaps, setSwap } = useSwapStore();
    const { swapsAmount, setSwapAmount } = useSwapAmountStore();
    const [focus, setFocus] = useState("from");

    const setToken = (element: string, value: any) => {
        // console.log(element,value, 4444)
        if (value) {

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
                        decimals: value.decimals,
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
                        decimals: swaps.to.decimals,
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
                        decimals: swaps.from.decimals,
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
                        decimals: value.decimals,
                    },
                });
            }
            // console.log(focus, "******", swaps)
            // if (focus === SwapKeys.From) {
            //     setAmount(focus, swapsAmount.from.amount)
            // } else {
            //     setAmount(focus, swapsAmount.to.amount)
            // }
        }
    };

    const setAmount = (element: string, value: number | '' | null) => {
        console.log(element, "******",value,swaps)
        let num: number | string = "";
        // if (value=== ''|| value ===null || value < 0) value = 0;
        if (element === SwapKeys.From) {
            // @ts-ignore
            if (value > 0) {
                // @ts-ignore
                num = swaps.from.price / swaps.to.price * value * (1 - swaps.to.buyFee);
                num = Number(num.toFixed(6));
            }
            setSwapAmount({
                from: {
                    token: swaps.from.symbol,
                    // @ts-ignore
                    amount: value,
                    id: swaps.from.id
                },
                to: {
                    token: swaps.to.symbol,
                    // @ts-ignore
                    amount: num,
                    id: swaps.to.id
                },
            });
        } else {
            // @ts-ignore
            if (value > 0) {
                // @ts-ignore
                num = swaps.to.price / swaps.from.price * value;
                num = Number(num.toFixed(6));
            }
            setSwapAmount({
                from: {
                    token: swaps.from.symbol,
                    // @ts-ignore
                    amount: num,
                    id: swaps.from.id
                },
                to: {
                    token: swaps.to.symbol,
                    // @ts-ignore
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
                decimals: swaps.to.decimals,
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
                decimals: swaps.from.decimals,
            },
        });
        let value;
        let num;
        if (focus === SwapKeys.From) {
            value = swapsAmount.from.amount;
            if (value)
                num = swaps.from.price / swaps.to.price * value;
            num = 0;
            setSwapAmount({
                from: {
                    token: swaps.to.symbol,
                    amount: Number(num.toFixed(6)),
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
            if (value)
                num = swaps.to.price / swaps.from.price * value * (1 - swaps.from.sellFee);
            num = 0;
            setSwapAmount({
                from: {
                    token: swaps.to.symbol,
                    amount: value,
                    id: swaps.to.id
                },
                to: {
                    token: swaps.from.symbol,
                    amount: Number(num.toFixed(6)),
                    id: swaps.from.id
                },
            });
        }
    };

    const swapArray = Object.keys(swaps) as Array<SwapKeys>;

    const fromPrice = useMemo(() => {
        if (swapsAmount.from.amount && swaps.from.symbol !== DEFAULT_TOKEN) {
            const price =
                swapsAmount.from.amount * swaps.from.price * (1 - swaps.from.sellFee);

            return price > 0 ? Number(price.toFixed(6)) : 0;
        }
        return 0;
    }, [swaps, swapsAmount]);

    const toPrice = useMemo(() => {
        if (swapsAmount.to.amount && swaps.to.symbol !== DEFAULT_TOKEN) {
            const price =
                swapsAmount.to.amount * swaps.to.price;

            return price > 0 ? Number(price.toFixed(6)) : 0;
        }
        return 0;
    }, [swaps, swapsAmount]);

    const priceImpact = useMemo(() => {
        if (swapsAmount.to.amount !== '' && swapsAmount.from.amount !== '' && swaps.to.symbol !== DEFAULT_TOKEN) {
            const fromV = swaps.from.currentValue / 10 ** 6;
            const fromQ = swaps.from.currentQuantity / 10 ** swaps.from.decimals;
            const toV = swaps.to.currentValue / 10 ** 6;
            const toQ = swaps.to.currentQuantity / 10 ** swaps.to.decimals;
            const priceF = fromV / fromQ;
            const priceT = toV / toQ;
            const ncvf = priceF * swapsAmount.from.amount;
            const ncvt = priceT * swapsAmount.to.amount;
            const priceFN = (fromV - ncvf) / (fromQ + swapsAmount.from.amount * 1);
            const priceTN = (toV + ncvt) / (toQ - swapsAmount.to.amount * 1);
            const initial = priceF / priceT;
            const newP = priceFN / priceTN;
            const ippact = (newP - initial) / initial * 100
            // console.log(fromQ,toQ,priceF,priceT,priceFN,priceTN,1111)
            return ippact.toFixed(2);
        }
    }, [swapsAmount.to.amount]);

    const disabled = useMemo(() => {
        return (
            swaps.from.symbol === DEFAULT_TOKEN ||
            swaps.to.symbol === DEFAULT_TOKEN ||
            swapsAmount.from.amount === 0 ||
            localStorage.getItem("wallet") === null
        );
    }, [swaps, swapsAmount, localStorage.getItem("wallet")]);

    return {
        swaps,
        swapsAmount,
        priceImpact,focus,
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
import useSwap from "@/hooks/useSwap";
import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { cn } from "@/utils/utils";
import TokenSwapSelector from "./TokenSwapSelector";
import TokenSwapSetting from "./TokenSwapSetting";
import useWallet from "@/hooks/useWallet";
import InputNumber from "rc-input-number";
import { useMemo, useState } from "react";

import { ArrowDownOutlined, DownOutlined, UpOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Spin, message } from 'antd';
import Message from '@/components/MessModal/index';


import { prettifyBalance } from '@/graphql/util';
import { GoodsDatas } from '@/graphql/swap/index';

import { useValueGood, useGoodId } from "@/stores/valueGood";

// git提交描述
// swap module overall change adjustment；
// ﻿graphql catalog optimization and adjustment.

const styles = {
    wrapper:
        "wrapper md:w-full h-[100vh] flex justify-center items-center p-4 md:p-0",
    boxContainer: //"relative w-full h-[480px] max-w-md p-8 bg-white rounded-2xl shadow-md border border-gray-200",
        "relative w-full max-w-lg p-6 bg-white rounded-2xl shadow-md border border-gray-200",
    arrowButton:
        "text-gray-500 z-1 absolute top-[41%] z-10 px-4 py-2 rounded-md  focus:outline-none transition-all duration-300",
    form: "space-y-4 z-2 text-black",
    swapButton: `w-full text-black 
        color-[#f0f8ff]
        bg-gradient-to-r from-[#83e3d6] to-[#a9f4d3] 
        disabled:bg-gradient-to-r disabled:from-[#919496] disabled:to-[#d8e0e0] disabled:shadow-none 
        hover:bg-gradient-to-br 
        focus:outline-none 
        shadow-lg shadow-[#a9f4d3]/50 dark:shadow-lg dark:shadow-[#a9f4d3]/80 
        font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2`,
    input:
        "*:*:w-full *:*:outline-none text-black text-3xl border-none mt-1 p-2 border w-[70%] rounded-md outline-none focus:border-blue-500 disabled:*:*:bg-white disabled:*:*:cursor-not-allowed disabled:*:*:opacity-50 bg-white",
    price: "w-full text-black flex flex-row justify-between px-3",
    label: "block px-2 text-sm font-medium text-black",
    inputWrapper: "w-full flex flex-row gap-12",
    balance: "p-2 flex justify-between text-sm",
};

const TokenSwap = () => {
    const {
        swaps,
        swapsAmount,
        fromPrice,
        toPrice,
        priceImpact,
        setAmount,
        setToken,
        setFocus,
        handleFlip,
        disabled,
    } = useSwap();
    const { balanceMap, networkCost, swapBuyGood } = useWallet();


    const [spinning, setSpinning] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const { info } = useValueGood();
    const { goodId } = useGoodId();

    const [isFees, setFees] = useState(true);
    const [istotal, setIstotal] = useState(false);
    const [tolerance, setTolerance] = useState(0.5);
    const [balanceF, setBalanceF] = useState<string | number>(0);
    const [balanceT, setBalanceT] = useState<string | number>(0);

    const [open, setOpen] = useState(false);
    const [mesStatus, setMesStatus] = useState("");
    const [mesTitle, setMesTitle] = useState("");

    const isDisabled = useMemo(() => {
        // @ts-ignore
        if (swapsAmount.from.amount > balanceMap.from || swapsAmount.from.amount < 0 || window.localStorage.getItem("wallet") === null) {
            return true;
        }
        return disabled;
    }, [swapsAmount.from.amount, disabled, balanceMap, window.localStorage.getItem("wallet")]);
    // console.log()
    useMemo(() => {
        // @ts-ignore
        setBalanceF(balanceMap.from); setBalanceT(balanceMap.to);
    }, [balanceMap]);

    const handleFees = () => {
        if (isFees) {
            setFees(false);
        } else {
            setFees(true);
        }
    };
    useMemo(() => {
        // console.log(sessionStorage.getItem("swap") !=="undefined",99998888)
        if (info.id) {
            (async () => {
                let sel = "";
                if (goodId.swap.id !== "") {
                    // 
                    sel = goodId.swap.id;
                }

                let tokens: any = await GoodsDatas({
                    id: info.id,
                    sel: sel
                });
                if (goodId.swap.id !== "") {
                    // 
                    setToken("from", tokens.tokens[0].children[0]);
                } else {
                    setToken("from", tokens.tokenValue[0]);
                }
            })();
        }
    }, [info, goodId]);

    // console.log(getExplorer(11155111))
    const handleSwap = async () => {
        setSpinning(true);

        const fromV = swaps.from.currentValue / swaps.from.currentQuantity * 10 ** swaps.from.decimals;
        const toV = swaps.to.currentValue / swaps.to.currentQuantity * 10 ** swaps.to.decimals;
        let limitPrice;
        let dec;
        if (Number(swaps.from.decimals) < Number(swaps.to.decimals) || Number(swaps.from.decimals) === Number(swaps.to.decimals)) {

            dec = 10 ** (Number(swaps.to.decimals) - Number(swaps.from.decimals));
        } else {
            dec = 10 ** (Number(swaps.from.decimals) - Number(swaps.to.decimals));
        }


        if (fromV > toV) {
            const toVl = Math.ceil(fromV / toV * (1 - tolerance / 100));
            limitPrice = BigInt(1 * dec) + BigInt(toVl * 2 ** 128);
            console.log(1, toVl, fromV / toV, 22555522222222, limitPrice, swaps)
        } else {
            const toVl = Math.ceil(toV / fromV * (1 + tolerance / 100));
            limitPrice = BigInt(1 * dec * 2 ** 128) + BigInt(toVl);
            console.log(1, toVl, fromV / toV, 22555522222222, limitPrice, swaps)
        }

        const a: BigInt = BigInt(Number(swapsAmount.from.amount) * 10 ** swaps.from.decimals);
        // const b: BigInt = BigInt(Number(swapsAmount.to.amount) * 10 ** swaps.to.decimals);
        // const b: BigInt = BigInt(1.1 * 2 ** 128 + 3500);
        console.log(a, 2222222222)
        const isSuccess = await swapBuyGood([swaps.from.id, swaps.to.id, a, limitPrice, istotal], a, swaps.from.address);
        // const isSuccess = await swapBuyGood(["51649299683075463979090664991608549190737649190809275440655607745038800234274", "14700013424982216455688397208100595100161518504028027706369398309082945288267", a, b, istotal], a.toString(), "0x0000000000000000000000000000000000000000");
        // const isSuccess = false;
        console.log("isSuccess:", isSuccess)
        if (isSuccess) {
            setOpen(true);
            setMesStatus("success");
            setMesTitle("Swap data send success");
            // messageApi.open({
            //     type: 'success',
            //     content: 'Swap data send success',
            // });
        } else {
            setOpen(true);
            setMesStatus("error");
            setMesTitle("Swap data send fail");
            // messageApi.open({
            //     type: 'error',
            //     content: 'Swap data send fail',
            // });
        }
        setSpinning(false);
    };
    // console.log(balanceMap)
    return (
        <>
            {/* {contextHolder} */}
            <Message
                open={open}
                status={mesStatus}
                title={mesTitle}
                setOpen={setOpen}
            />
            <Spin spinning={spinning} fullscreen indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} size="large" />
            <div className={""} >
                {/* <ChainSelector/> */}
                <div className={cn(styles.boxContainer, "box-shadow")}>
                    <form className="">
                        <div className="flex justify-between h-[30px]">
                            <h5 className="text-2xl font-semibold mb-4">Swap</h5>
                            <TokenSwapSetting
                                value={tolerance}
                                value1={istotal}
                                onChange={(val, val1) => {
                                    setTolerance(val)
                                    setIstotal(val1)
                                }}
                            />
                        </div>
                        <div
                            // key={swaps.from.symbol + 0}
                            className="border z-11 rounded-xl p-2 space-y-4"
                            style={{ marginTop: "20px" }}
                        >
                            <label className={styles.label}>
                                From
                            </label>
                            <div className="swToFT">
                                <InputNumber
                                    disabled={swaps.from.symbol === DEFAULT_TOKEN}
                                    // width={85}
                                    min={0}
                                    type="number"
                                    max={999999999}
                                    pattern="[0-9]*[.]?[0-9]+"
                                    name={"from"}
                                    value={swapsAmount.from.amount}
                                    onChange={(e) => { setAmount("from", e); console.log("*&*^99") }}
                                    className={styles.input}
                                    controls={false}
                                    placeholder="0"
                                    onClick={() => setFocus("from")}
                                />
                                <TokenSwapSelector
                                    value={swaps.from}
                                    onChange={(val) => setToken("from", val)}
                                />
                            </div>
                            <div className={styles.balance}>
                                <span>
                                    {fromPrice > 0 ? fromPrice : 0}{" " + info.symbol}{" "}
                                    {fromPrice !== 0 &&
                                        swaps.from.symbol !== DEFAULT_TOKEN && (
                                            <span className="text-[#63ae8e] ml-2">{(swaps.from.sellFee * 100).toFixed(2)}%</span>
                                        )}
                                </span>
                                <span
                                    className={cn(
                                        swaps.from.symbol !== DEFAULT_TOKEN &&
                                        swapsAmount.from.amount >
                                        balanceF &&
                                        "text-red-500 shake"
                                    )}
                                >
                                    Balance:{" "}
                                    <span
                                        className="cursor-pointer"
                                        onClick={() =>
                                            // @ts-ignore
                                            setAmount("from", balanceF)
                                        }
                                    >
                                        {swaps.from.symbol !== DEFAULT_TOKEN
                                            ? prettifyBalance(Number(balanceF))
                                            : 0}
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className="swapBut">
                            <Button
                                className="swapButSt"
                                icon={<ArrowDownOutlined />}
                                onClick={handleFlip}
                            >
                            </Button>
                        </div>
                        <div
                            // key={swaps.from.symbol + 0}
                            className="border z-11 rounded-xl p-2"
                        >
                            <label className={styles.label}>
                                To (estimated)
                            </label>
                            <div className="swToFT">
                                <InputNumber
                                    disabled={swaps.from.symbol === DEFAULT_TOKEN || swaps.to.symbol === DEFAULT_TOKEN}
                                    width={85}
                                    min={0}
                                    type="number"
                                    max={999999999}
                                    pattern="[0-9]*[.,]?[0-9]+"
                                    name={"to"}
                                    value={swapsAmount.to.amount}
                                    onChange={(e) => { setAmount("to", e); }}
                                    className={styles.input}
                                    controls={false}
                                    placeholder="0"
                                    onClick={() => setFocus("to")}
                                />
                                <TokenSwapSelector
                                    value={swaps.to}
                                    onChange={(val) => setToken("to", val)}
                                />
                            </div>
                            <div className={styles.balance}>
                                <span>
                                    {toPrice > 0 ? toPrice : 0}{" " + info.symbol}{" "}
                                    {toPrice !== 0 &&
                                        swaps.to.symbol !== DEFAULT_TOKEN && (
                                            <span className="text-[#63ae8e] ml-2">{(swaps.to.buyFee * 100).toFixed(2)}%</span>
                                        )}
                                </span>
                                <span
                                // className={cn(
                                //   swaps.to.symbol !== DEFAULT_TOKEN &&
                                //   swapsAmount.to.amount >
                                //   balanceT &&
                                //   "text-red-500 shake"
                                // )}
                                >
                                    Balance:{" "}
                                    <span
                                        className="cursor-pointer"
                                        onClick={() =>
                                            // @ts-ignore
                                            setAmount("to", balanceT)
                                        }
                                    >
                                        {swaps.to.symbol !== DEFAULT_TOKEN
                                            ? prettifyBalance(Number(balanceT))
                                            : 0}
                                    </span>
                                </span>
                            </div>
                        </div>
                        {/* </FlipMove> */}

                        <button
                            onClick={handleSwap}
                            type="button"
                            disabled={isDisabled}
                            className={cn(styles.swapButton, disabled && "text-[#c5f0ea]")}
                            style={{ marginTop: "10px" }}
                        >
                            Swap {!isDisabled && "✨"}
                        </button>
                    </form>
                    {swaps.to.symbol !== DEFAULT_TOKEN && swaps.from.symbol !== DEFAULT_TOKEN && (
                        <>
                            <div>
                                <div>
                                    <div className="flex justify-between pt-4">
                                        <div>Price impact warning</div>
                                        <div>{priceImpact ? priceImpact + '%' : ''}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 text-sm">
                                {/* <span>Price</span> <span>${computedPrice}</span> */}
                                <div className="flex cursor-pointer justify-between"
                                    onClick={handleFees}>
                                    <div>1 {swaps.from.symbol} = {(swaps.from.price / swaps.to.price).toFixed(6)} {swaps.to.symbol}</div>
                                    <div>
                                        {isFees && (
                                            <UpOutlined />
                                        )}
                                        {!isFees && (
                                            <DownOutlined />
                                        )}
                                    </div>
                                </div>
                                {isFees && (
                                    <div>
                                        <div className="se pt-4">
                                            <div className="flex justify-between">
                                                <div>Price impact</div>
                                                <div>{priceImpact ? priceImpact + '%' : ''}</div>
                                            </div>
                                            <div className="flex justify-between">
                                                <div>Tolerance</div>
                                                <div>{tolerance}%</div>
                                            </div>
                                            <div className="flex justify-between">
                                                <div>Fee</div>
                                                <div>{
                                                    // @ts-ignore
                                                    ((swaps.to.buyFee * swaps.to.price * swapsAmount.to.amount + swaps.from.sellFee * swapsAmount.from.amount * swaps.from.price)).toFixed(6)}{" "}{info.symbol}</div>
                                            </div>
                                            {/* <div className="flex justify-between">
                        <div>Network cost</div>
                        <div>{networkCost}</div>
                      </div> */}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default TokenSwap;

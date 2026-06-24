import {
    TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    ArrowUpDown,
    Settings,
    ChevronDown,
    RefreshCw,
    Shield,
} from "lucide-react";
// import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, message, Tooltip, InputNumber } from 'antd';
// import { TokenSelectionDialog } from "@/components/dialogs/TokenSelectionDialog";
import { SwapSeting } from "@/components/dialogs/SwapSetingDialog";
import { useTranslation } from 'react-i18next';
import { useValueGood, useGoodId } from "@/stores/valueGood";
import { useLocalStorage } from "@/utils/LocalStorageManager";
import useSwap from "@/hooks/useSwap";
import useWallet from "@/hooks/useWallet";
import { useAccount } from 'wagmi';
import { prettifyBalance, Timestamp } from '@/services/graphql/util';
import { GoodsDatas, newGoodsPrice, SwapNum, myRefer } from '@/services/graphql/swap/index';
import { useMaxApprove } from '@/hooks/useMaxApprove';
import { useErrorMess } from '@/hooks/useErrorMess';
import { TokenIcon } from '@/components/common/TokenIcon';
import { GRK_SIZES, DEFAULT_TOKEN } from "@/types/common";
// import { TokenPayload, SwapTokenValue } from "@/types/token";
import Message from '@/components/MessModal/index';

interface TradingPageProps {
    defaultTab?: string;
    token?: any;
    timeKey?: number;
    selectToken?: any;
    openTokenSelection: (type: string) => void;
}


export default function TokenSwap({ timeKey, token, selectToken, openTokenSelection }: TradingPageProps) {
    const {
        swaps,
        swapsAmount,
        setAmount,
        setToken,
        handleFlip,
        disabled,
    } = useSwap();
    const { balanceMap, swapBuyGood } = useWallet();

    const { t } = useTranslation();
    const { info } = useValueGood();
    const { ssionChian } = useLocalStorage();
    const { isConnected, address } = useAccount();
    const [spinning, setSpinning] = useState(false);
    const { goodId } = useGoodId();

    const [slippage, setSlippage] = useState("0.5");
    const [showSettings, setShowSettings] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [antiMEV, setAntiMEV] = useState(true);
    // const [maxApproval, setMaxApproval] = useState(false);


    const [isFees, setFees] = useState(true);
    const { maxApprove, setMaxApprove } = useMaxApprove();
    const [balanceF, setBalanceF] = useState<string | number>(0);
    const [balanceT, setBalanceT] = useState<string | number>(0);

    const [open, setOpen] = useState(false);
    const [mesStatus, setMesStatus] = useState("");
    const [mesTitle, setMesTitle] = useState("");
    const [amountSp, setAmountSp] = useState(false);
    const [timerId, setTimerId] = useState(null);
    const [focus, setFocus] = useState("from");
    const [handleF, setHandleF] = useState(false);
    // const [mevValue, setMevValue] = useState(true);
    const [isDisabled, setisDisabled] = useState(disabled);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        console.log(timeKey, "09090=-=")
        setAmount("from", 0, 0);
    }, [timeKey]);

    useEffect(() => {
        // @ts-ignore
        if (swapsAmount.from.amount > balanceMap.from || swapsAmount.from.amount <= 0 || swapsAmount.from.amount === "" || swapsAmount.from.amount === null) {
            setisDisabled(true);
        } else { setisDisabled(disabled); }
    }, [swapsAmount, disabled, balanceMap]);

    useEffect(() => {
        // @ts-ignore
        setBalanceF(balanceMap.from); setBalanceT(balanceMap.to);
        // console.log(balanceMap,swaps,99998888)
    }, [balanceMap, ssionChian]);

    const handleFees = () => {
        if (isFees) {
            setFees(false);
        } else {
            setFees(true);
        }
    };
    useEffect(() => {
        console.log(token, goodId, 9988)
        if (goodId.swap.id !== "" && goodId.swap.id !== undefined) {
            setToken("from", token?.tokens[0]);
        } else {
            setToken("from", token?.tokenValue[0]);
        }
    }, [token]);

    useEffect(() => {
        console.log(999988000088, selectToken)
        handleTokenSelect(selectToken);
    }, [selectToken]);

    useEffect(() => {
        handleFlips();
        goodsF();
    }, [swaps]);

    const setAmounts = (type: string, value: any) => {
        console.log(value, "-----")
        setFocus(type);
        // setAmount(type, value, 0);
        if (value > 0) {
            setAmountSp(true)
            // 清除之前的定时器
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }

            // 设置新的防抖定时器
            debounceTimer.current = setTimeout(async () => {
                try {
                    // @ts-ignore
                    const datas = await newGoodsPrice({ id: info.id, from: swaps.from.id, to: swaps.to.id }, ssionChian);
                    setAmount(type, value, datas);
                } catch (error) {
                    setAmount(type, value, 0);
                    console.error('Failed to fetch price:', error);
                } finally {
                    setAmountSp(false);
                }
            }, 1000); // 防抖 500ms
        } else {
            setAmount(type, value, 0);
        }
    };


    const handleFlips = () => {
        // handleFlip();
        if (handleF) {
            let amount;
            let type;
            if (focus === "from") {
                amount = swapsAmount.from.amount;
                type = "to";
            } else {
                amount = swapsAmount.to.amount;
                type = "from";
            }
            // console.log(swaps,"****")
            setAmounts(type, amount);
            setHandleF(false);
        }
    };

    const goodsF = () => {
        let amount;
        let type;
        if (focus === "from") {
            amount = swapsAmount.from.amount;
            type = "to";
        } else {
            amount = swapsAmount.to.amount;
            type = "from";
        }
        setAmounts(focus, amount);
    };
    const handleSwap = async () => {

        setSpinning(true);
        const a: bigint = BigInt(Math.round(Number(swapsAmount.from.amount) * 10 ** swaps.from.decimals));
        const b: bigint = BigInt(Math.round(Number(swapsAmount.to.amount) * 10 ** swaps.to.decimals*(1-Number(slippage)/100)));
        console.log(a, "*****", b)
        // const b1: bigint = BigInt(Math.round(Number(swapsAmount.to.amount) * 10 ** swaps.to.decimals)*(1-Number(slippage)/100));
        let swapquantity;
        if (antiMEV) {
            swapquantity = a * BigInt(2 ** 128) + b;
        } else {
            swapquantity = a * BigInt(2 ** 128) + BigInt(0);
        }
        // const s = await swapCount(swaps.from.id, a);
        const datas: any = await myRefer(address, ssionChian);
        // console.log(a, 2222222222, s, datas)
        const isSuccess = await swapBuyGood([swaps.from.address, swaps.to.address, swapquantity, 1], a, swaps.from.address, swaps.from.symbol, maxApprove, datas.refer);
        console.log("isSuccess:", isSuccess)
        if (isSuccess === true) {
            setOpen(true);
            setMesStatus("success");
            setMesTitle(t('common.swap') + t('common.mess.success'));
            setAmount("from", "", 0);
        } else if (isSuccess === false) {
            setOpen(true);
            setMesStatus("error");
            setMesTitle(t('common.swap') + t('common.mess.error'));
        } else {
            let yz = "";
            if (isSuccess === 7) {
                let n;
                n = swaps.to.currentQuantity - swaps.to.currentQuantity / 10;
                yz = "; <" + n + swaps.to.symbol;
            }
            if (isSuccess === 14) {
                let n;
                n = 2 * 1e6 * swaps.from.currentQuantity / (2 * swaps.from.currentValue - 1e6) / (1 - swaps.from.buyFee);
                n = Math.floor(n);
                n = n / 10 ** swaps.from.decimals;
                yz = "; >=" + n + swaps.from.symbol;
            }
            setOpen(true);
            setMesStatus("error");
            setMesTitle(useErrorMess(isSuccess, t) + yz);
        }

        setSpinning(false);
    };

    // 渲染代币图标
    const renderTokenIcon = (token: any) => {
        return (
            <TokenIcon
                isValueToken={token.isvaluegood}
                icon={token.logo_url}
                color=""
                size={GRK_SIZES.SMALL}
                showPulse={token.isvaluegood}
            />
        );
    };

    const calculateBuyFee = (a: number) => {
        return a.toFixed(6);
    };

    const calculateSlippage = () => {
        // if (!amountTo) return "0.00";
        const slippageAmount = (Number(swapsAmount.to.amount) * ((swaps.to.buyFee) + Number(slippage))) / 100;
        return slippageAmount.toFixed(6);
    };


    // 打开代币选择弹框
    // const openTokenSelection = (type: "from" | "to") => {
    //     setTokenSelectionType(type);
    //     setShowTokenSelection(true);
    // };

    // 选择代币
    const handleTokenSelect = (token: any) => {
        if (token?.tokenSelectionType === "sFrom") {
            setToken("from", token);
        } else if (token?.tokenSelectionType === "sTo") {
            setToken("to", token);
        }
        // setShowTokenSelection(false);
    };

    return (
        <>
            <Message
                open={open}
                status={mesStatus}
                title={mesTitle}
                setOpen={setOpen}
            />
            <Spin spinning={spinning} fullscreen indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} size="large" />
            <TabsContent value="swap" className="mt-0 space-y-4">
                {/* From Token */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm text-muted-foreground">{t("trade.swap.from")}</Label>
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-muted-foreground">
                                {t('trade.balance')}:{" "}{swaps.from.symbol !== DEFAULT_TOKEN
                                    ? prettifyBalance(Number(balanceF))
                                    : 0}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-[#0fb981] hover:text-[#22c55e] hover:bg-[#0fb981]/10"
                                onClick={() =>
                                    // @ts-ignore
                                    setAmounts("from", balanceF)
                                }
                            >
                                {t("trade.max")}
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 h-auto p-2 hover:bg-white"
                            onClick={() => openTokenSelection("sFrom")}
                        >
                            {swaps.from.symbol != DEFAULT_TOKEN ? (
                                <>
                                    {renderTokenIcon(swaps.from)}
                                    <div className="text-left">
                                        <div className="font-medium">{swaps.from.symbol}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {swaps.from.name}
                                        </div>
                                    </div>
                                </>) : (
                                <>
                                    <div className="text-left">
                                        <div className="font-medium">{t('trade.token.sel')}</div>
                                    </div>
                                </>)}
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </Button>

                        <div className="flex-1 text-right">
                            <InputNumber
                                disabled={swaps.from.symbol === DEFAULT_TOKEN}
                                value={swapsAmount.from.amount}
                                onChange={(e) => { setAmounts("from", e); }}
                                onClick={() => setFocus("from")}
                                placeholder="0"
                                min={0}
                                type="number"
                                max={999999999}
                                pattern="[0-9]*[.]?[0-9]+"
                                size="large"
                                className="text-right bg-white border border-gray-200 rounded-lg text-lg font-medium h-10 px-3 focus-visible:ring-2 focus-visible:ring-[#0fb981] focus-visible:border-[#0fb981] hover:border-gray-300 transition-colors"
                                style={{ width: "100%", height: "100%" }}
                            />
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 text-right">
                        <Spin
                            spinning={amountSp}
                            indicator={<LoadingOutlined spin />}
                            size="small">
                            ≈
                            {" "}{swapsAmount.from.price > 0 ? swapsAmount.from.price : 0}{" " + info.symbol}{" "}
                        </Spin>
                    </div>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center relative z-10">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-10 h-10 rounded-full bg-white border-2 border-gray-100 hover:bg-gray-50 shadow-sm"
                        onClick={() => {
                            handleFlip();
                            setHandleF(true);
                        }}
                    >
                        <ArrowUpDown className="h-4 w-4" />
                    </Button>
                </div>

                {/* To Token */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm text-muted-foreground">{t("trade.swap.to")}</Label>
                        <div className="text-sm text-muted-foreground">
                            {t("trade.balance")}:{" "} {swaps.to.symbol !== DEFAULT_TOKEN
                                ? prettifyBalance(Number(balanceT))
                                : 0}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 h-auto p-2 hover:bg-white"
                            onClick={() => openTokenSelection("sTo")}
                        >
                            {swaps.to.symbol != DEFAULT_TOKEN ? (
                                <>
                                    {renderTokenIcon(swaps.to)}
                                    <div className="text-left">
                                        <div className="font-medium">{swaps.to.symbol}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {swaps.to.name}
                                        </div>
                                    </div>
                                </>) : (
                                <>
                                    <div className="text-left">
                                        <div className="font-medium">{t('trade.token.sel')}</div>
                                    </div>
                                </>)}
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </Button>

                        <div className="flex-1 text-right">
                            <InputNumber
                                disabled={swaps.to.symbol === DEFAULT_TOKEN}
                                min={0}
                                type="number"
                                max={999999999}
                                pattern="[0-9]*[.,]?[0-9]+"
                                name={"to"}
                                value={swapsAmount.to.amount}
                                onChange={(e) => { setAmounts("to", e); }}
                                placeholder="0"
                                onClick={() => setFocus("to")}
                                size="large"
                                className="text-right bg-white border border-gray-200 rounded-lg text-lg font-medium h-10 px-3 focus-visible:ring-2 focus-visible:ring-[#0fb981] focus-visible:border-[#0fb981] hover:border-gray-300 transition-colors"
                                style={{ width: "100%", height: "100%" }}
                            />
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 text-right">
                        <Spin
                            spinning={amountSp}
                            indicator={<LoadingOutlined spin />}
                            size="small">
                            ≈{" "}{swapsAmount.to.price > 0 ? swapsAmount.to.price : 0}{" " + info.symbol}{" "}
                        </Spin>
                    </div>
                </div>

                {/* Exchange Details */}
                {!isDisabled && (
                    <div className="p-4 bg-blue-50 rounded-lg space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                {t("trade.swap.ratio")}
                            </span>
                            <span className="font-medium">
                                1 {swaps.from.symbol} ≈ {(Number(swapsAmount.to.amount) / Number(swapsAmount.from.amount)).toFixed(6)} {swaps.to.symbol}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                {t("trade.swap.goods.sellfee")}{" "}({(swaps.from.sellFee * 10000)}‱)
                            </span>
                            <span className="font-medium">
                                {calculateBuyFee(swaps.from.sellFee * Number(swapsAmount.from.amount))} {swaps.from.symbol}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                {t("trade.swap.goods.buyfee")}{" "}({(swaps.to.buyFee * 10000)}‱)
                            </span>
                            <span className="font-medium">
                                {calculateBuyFee(swaps.to.buyFee * Number(swapsAmount.to.amount))} {swaps.to.symbol}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">
                                    {t("trade.swap.tolerance")}
                                </span>
                            </div>
                            <span className="font-medium">
                                {slippage}%
                            </span>
                        </div>

                        <Separator className="bg-blue-200" />

                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                                {t("trade.swap.expected")}
                            </span>
                            <span className="font-medium">
                                {(
                                    Number(swapsAmount.to.amount) -
                                    Number(calculateSlippage())
                                ).toFixed(6)}{" "}
                                {swaps.to.symbol}
                            </span>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                    <div className="flex gap-3">
                        {isDisabled ? (
                            <Button
                                className="flex-1 h-12 bg-gray-200 text-gray-500 cursor-not-allowed"
                                disabled
                            >
                                {t("trade.swap.placeholder")}
                            </Button>
                        ) : (
                            <Button
                                className="flex-1 h-12 bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm btn-modern hover-glow transition-all duration-300"
                                onClick={handleSwap}
                            // disabled={isLoading}
                            >
                                <div className="flex items-center gap-2">
                                    <span>
                                        {t("common.swap")} {swaps.from.symbol} →{" "}
                                        {swaps.to.symbol}
                                    </span>
                                    {antiMEV && (
                                        <Badge
                                            variant="secondary"
                                            className="text-xs bg-blue-100 text-blue-700 border-blue-200"
                                        >
                                            <Shield className="h-3 w-3 mr-1" />
                                            {t("trade.swap.protect")}
                                        </Badge>
                                    )}
                                </div>
                            </Button>
                        )}
                        {/* 设置按钮 */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 border-gray-200 hover:border-[#0fb981] hover:text-[#0fb981]"
                            onClick={() => setShowSettings(!showSettings)}
                        >
                            <Settings className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </TabsContent>

            <SwapSeting
                open={showSettings}
                onOpenChange={setShowSettings}
                onChange={(val: string, val1: boolean, val2: boolean) => {
                    setSlippage(val);
                    setAntiMEV(val1);
                    setMaxApprove(val2);
                }}
            />

            {/* 代币选择弹框 */}
            {/* <TokenSelectionDialog
                open={showTokenSelection}
                onOpenChange={setShowTokenSelection}
                info={info}
                ssionChian={ssionChian}
                onSelectToken={handleTokenSelect}
                selectedToken={
                    tokenSelectionType === "from"
                        ? swaps.from
                        : tokenSelectionType === "to"
                            ? swaps.to
                            : null
                }
                title={t("trade.selection.title")}
            /> */}
        </>
    );
}
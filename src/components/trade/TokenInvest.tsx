import {
    TabsContent,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    ChevronDown,
    // RefreshCw,
    TrendingUp,
} from "lucide-react";
// import { toast } from "sonner";
import { useState, useEffect, useRef  } from "react";
// import { TokenSelectionDialog } from "@/components/dialogs/TokenSelectionDialog";
import { useTranslation } from 'react-i18next';
import { useValueGood, useGoodId } from "@/stores/valueGood";
import { useLocalStorage } from "@/utils/LocalStorageManager";
import useInvest from "@/hooks/useInvest";
import useWallet from "@/hooks/useWallet";
import { useAccount } from 'wagmi';
import { prettifyBalance, Timestamp, powerIterative } from '@/services/graphql/util';
import { newGoodsPrice } from '@/services/graphql/swap/index';
// import { GoodsDatas } from '@/services/graphql/invest';
import { useMaxApprove } from '@/hooks/useMaxApprove';
import { useErrorMess } from '@/hooks/useErrorMess';
import { TokenIcon } from '@/components/common/TokenIcon';
import { GRK_SIZES, DEFAULT_TOKEN } from "@/types/common";
// import { TokenPayload, SwapTokenValue } from "@/types/token";
import Message from '@/components/MessModal/index';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, message, Tooltip, InputNumber } from 'antd';

interface TradingPageProps {
    defaultTab?: string;
    token?: any;
    selectToken?: any;
    openTokenSelection: (type: string) => void;
}


export default function TokenInvest({ defaultTab, token, selectToken, openTokenSelection }: TradingPageProps) {
    const {
        invest,
        investAmount,
        setAmount,
        setToken,
        disabled,
    } = useInvest();
    const { balanceMap1, investGoods } = useWallet();

    const { t } = useTranslation();
    const { info } = useValueGood();
    const { ssionChian } = useLocalStorage();
    // const { isConnected, address } = useAccount();
    const [spinning, setSpinning] = useState(false);
    const { goodId } = useGoodId();

    const [balanceF, setBalanceF] = useState<string | number>(0);
    const [balanceT, setBalanceT] = useState<string | number>(0);
    const [isValueGood, setIsValueGood] = useState(true);

    const [open, setOpen] = useState(false);
    const [mesStatus, setMesStatus] = useState("");
    const [mesTitle, setMesTitle] = useState("");
    const [amountSp, setAmountSp] = useState(false);
    const [timerId, setTimerId] = useState(null);
    const [focus, setFocus] = useState("from");
    const [isDisabled, setisDisabled] = useState(disabled);
    const { maxApprove, setMaxApprove } = useMaxApprove();


    useEffect(() => {
        if (isValueGood) {
            // @ts-ignore
            if (Number(investAmount.from.amount) > balanceMap1.from || balanceMap1.from === 0 || Number(investAmount.from.amount) === 0 || Number(investAmount.from.amount) < 0 || investAmount.from.amount === "" || investAmount.from.amount === null) {
                setisDisabled(true);
            } else { setisDisabled(disabled); }

        } else {
            // @ts-ignore
            if (Number(investAmount.from.amount) > balanceMap1.from || Number(investAmount.to.amount) > balanceMap1.to || balanceMap1.from === 0 || balanceMap1.to === 0 || Number(investAmount.from.amount) === 0 || Number(investAmount.from.amount) < 0 || investAmount.from.amount === "" || investAmount.from.amount === null) {
                setisDisabled(true);
            } else { setisDisabled(disabled); }
        }
        // return disabled;
    }, [investAmount, disabled, balanceMap1]);

    useEffect(() => {
        // @ts-ignore
        setBalanceF(balanceMap1.from); setBalanceT(balanceMap1.to);
    }, [balanceMap1, ssionChian]);

    useEffect(() => {
        if (goodId.invest.id !== "" && goodId.invest.id !== undefined) {
            setToken("from", token?.tokens[0]);
            setIsValueGood(token?.tokens[0]?.isvaluegood);
        } else {
            setToken("from", token?.tokenValue[0]);
            setIsValueGood(token?.tokenValue[0]?.isvaluegood);
        }
    }, [token]);

    useEffect(() => {
        console.log(999988000088, selectToken)
        handleTokenSelect(selectToken);
    }, [selectToken]);

    useEffect(() => {
        goodsF();
    }, [invest]);

    const setAmounts = (type: string, value: any) => {
        setFocus(type);
        if (value > 0) {
            setAmountSp(true)
            // @ts-ignore
            clearTimeout(timerId);
            let timer = setTimeout(async () => {
                // @ts-ignore
                const datas = await newGoodsPrice({ id: info.id, from: invest.from.id, to: invest.to.id }, ssionChian);
                setAmount(type, value, datas);
                clearTimeout(timer);
                setAmountSp(false)
            }, 1000);
            // @ts-ignore
            setTimerId(timer);
        } else {
            setAmount(type, value, 0);
        }
    };

    const goodsF = () => {
        let amount;
        let type;
        if (focus === "from") {
            amount = investAmount.from.amount;
            type = "to";
        } else {
            amount = investAmount.to.amount;
            type = "from";
        }
        setAmounts(focus, amount);
    };

    const handleInvest = async () => {
        setSpinning(true);
        // await switchChain(Number(ssionChian)).then(async () => {
        let fAmount = 0;
        let tAmount = 0;
        if (investAmount.from.amount !== "" && investAmount.from.amount > 0) {
            fAmount = investAmount.from.amount * powerIterative(10, invest.from.decimals);
        }
        if (investAmount.to.amount !== "" && investAmount.to.amount > 0 && !isValueGood) {
            tAmount = investAmount.to.amount * powerIterative(10, invest.to.decimals);
        }
        const isSuccess = await investGoods(invest, BigInt(Math.round(fAmount)), BigInt(Math.round(tAmount)), isValueGood, maxApprove);
        if (isSuccess === true) {
            setOpen(true);
            setMesStatus("success");
            setMesTitle(t('common.invest') + t('common.mess.success'));
            setAmount("from", "", 0);
        } else if (isSuccess === false) {
            setOpen(true);
            setMesStatus("error");
            setMesTitle(t('common.invest') + t('common.mess.error'));
        } else {
            let yz = "";
            if (isSuccess === 38) {
                let n;
                n = 1 * investAmount.from.currentQuantity / investAmount.from.currentValue / (1 - invest.from.investFee);
                yz = "; >" + n + invest.from.symbol;
            }
            setOpen(true);
            setMesStatus("error");
            setMesTitle(useErrorMess(isSuccess, t) + yz);
        }

        setSpinning(false);
    };

    // 计算投资手续费
    const calculateStakingFee = (
        a: any,
        b: any,
    ) => {
        return (Number(a.amount) * b.investFee).toFixed(6);
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


    // 打开代币选择弹框
    // const openTokenSelection = (type: "from" | "to") => {
    //     setTokenSelectionType(type);
    //     setShowTokenSelection(true);
    // };

    // 选择代币
    const handleTokenSelect = (token: any) => {
        if (token?.tokenSelectionType === "iFrom") {
            setToken("from", token);
            setIsValueGood(token?.isvaluegood);
        } else if (token?.tokenSelectionType === "iTo") {
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
            <TabsContent value="invest" className="mt-0 space-y-4">
                {/* 投资代币A */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm text-muted-foreground">
                            {t('trade.balance')}
                        </Label>
                        <div className="flex items-center gap-2">
                            <div className="text-sm text-muted-foreground">
                                {t('trade.balance')}:{" "}{invest.from.symbol !== DEFAULT_TOKEN
                                    ? prettifyBalance(Number(balanceF))
                                    : 0}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-[#0fb981] hover:text-[#22c55e] hover:bg-[#0fb981]/10"
                                onClick={() =>
                                    setAmounts("from", balanceF)
                                }
                            >
                                {t('trade.max')}
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 h-auto p-2 hover:bg-white"
                            onClick={() => openTokenSelection("iFrom")}
                        >
                            {invest.from.symbol != DEFAULT_TOKEN ? (
                                <>
                                    {renderTokenIcon(invest.from)}
                                    <div className="text-left">
                                        <div className="font-medium">{invest.from.symbol}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {invest.from.name}
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
                                disabled={invest.from.symbol === DEFAULT_TOKEN}
                                value={investAmount.from.amount}
                                onChange={(e) => { setAmounts("from", e); }}
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
                    {!isDisabled && (
                        <div className="space-y-1">
                            <Spin
                                spinning={amountSp}
                                indicator={<LoadingOutlined spin />}
                                size="small">
                                <div className="text-xs text-muted-foreground text-right">
                                    ≈ {" "}{investAmount.from.price > 0 ? investAmount.from.price : 0}{" " + info.symbol}{" "}
                                </div>
                                <div className="text-xs text-right">
                                    <span className="text-muted-foreground">
                                        {t('trade.fee')}:{" "} ({invest.from.investFee * 10000}‱):
                                    </span>{" "}
                                    <span className="font-medium">
                                        {calculateStakingFee(investAmount.from, invest.from)}
                                    </span>
                                </div>
                            </Spin>
                        </div>
                    )}
                </div>

                {/* <Separator className="bg-green-200" /> */}

                {/* 投资代币B */}
                {!isValueGood && (
                    <div className="bg-gray-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <Label className="text-sm text-muted-foreground">
                                {t('trade.balance')}
                            </Label>
                            <div className="flex items-center gap-2">
                                <div className="text-sm text-muted-foreground">
                                    {t('trade.balance')}:{" "}{invest.to.symbol !== DEFAULT_TOKEN
                                        ? prettifyBalance(Number(balanceT))
                                        : 0}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs text-[#0fb981] hover:text-[#22c55e] hover:bg-[#0fb981]/10"
                                    onClick={() =>
                                        setAmounts("to", balanceT)
                                    }
                                >
                                    {t('trade.max')}
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2 h-auto p-2 hover:bg-white"
                                onClick={() => openTokenSelection("iTo")}
                            >
                                {invest.to.symbol != DEFAULT_TOKEN ? (
                                    <>
                                        {renderTokenIcon(invest.to)}
                                        <div className="text-left">
                                            <div className="font-medium">{invest.to.symbol}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {invest.to.name}
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
                                    disabled={invest.from.symbol === DEFAULT_TOKEN || invest.to.symbol === DEFAULT_TOKEN}
                                    value={investAmount.to.amount}
                                    onChange={(e) => { setAmounts("to", e); }}
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
                        {!isDisabled && (
                            <div className="space-y-1">
                                <Spin
                                    spinning={amountSp}
                                    indicator={<LoadingOutlined spin />}
                                    size="small">
                                    <div className="text-xs text-muted-foreground text-right">
                                        ≈{" "}{investAmount.to.price > 0 ? investAmount.to.price : 0}{" " + info.symbol}{" "}
                                    </div>
                                    <div className="text-xs text-right">
                                        <span className="text-muted-foreground">
                                            {t('trade.fee')} ({invest.to.investFee * 10000}‱):
                                        </span>{" "}
                                        <span className="font-medium">
                                            {calculateStakingFee(investAmount.to, invest.to)}
                                        </span>
                                    </div>
                                </Spin>
                            </div>
                        )}
                    </div>
                )}

                {/* Investment Summary */}
                {!isDisabled ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-900">
                                {t('trade.invest.pool')}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    {invest.from.symbol} {t('common.invest')}
                                </span>
                                <span className="font-medium">
                                    {investAmount.from.amount}{" "}{invest.from.symbol}
                                </span>
                            </div>
                            {!isValueGood && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        {invest.to.symbol} {t('common.invest')}
                                    </span>
                                    <span className="font-medium">
                                        {investAmount.to.amount}{" "}{invest.to.symbol}
                                    </span>
                                </div>
                            )}

                            {/* <Separator className="my-2" />

                                    <div className="flex justify-between text-green-600 font-medium">
                                        <span>预期年收益率</span>
                                        <span>12.5% - 18.8%</span>
                                    </div> */}
                        </div>
                    </div>
                ) : null}

                {/* invest Action Buttons */}
                <div className="space-y-3 pt-2">
                    {isDisabled ? (
                        <Button
                            className="w-full h-12 bg-gray-200 text-gray-500 cursor-not-allowed"
                            disabled
                        >
                            {t('trade.invest.placeholder')}
                        </Button>
                    ) : (
                        <Button
                            className="w-full h-12 bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm"
                            onClick={handleInvest}
                        >
                            <div className="flex items-center gap-2">
                                <span>
                                    {!isValueGood
                                        ? `${t('common.invest')}${" "}${invest.from.symbol} + ${invest.to.symbol}`
                                        : `${t('common.invest')}${" "}${invest.from.symbol}`}
                                </span>
                                <Badge
                                    variant="secondary"
                                    className="text-xs bg-green-100 text-green-700 border-green-200"
                                >
                                    {t('trade.invest.guarantee')}
                                </Badge>
                            </div>
                        </Button>
                    )}
                </div>
            </TabsContent >

            {/* 代币选择弹框 */}
            {/* < TokenSelectionDialog
                open={showTokenSelection}
                onOpenChange={setShowTokenSelection}
                info={info}
                ssionChian={ssionChian}
                onSelectToken={handleTokenSelect}
                selectedToken={
                    tokenSelectionType === "from"
                        ? invest.from
                        : invest.to
                }
                title={t("trade.selection.title")}
            /> */}
        </>
    );
}
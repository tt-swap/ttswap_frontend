import { TypographyH4 } from "@/components/ui/typography";
import { type TokenV2VolumeWithChartData } from "@/utils/types/XykServiceTypes";
import { type Option, Some, None } from "@/utils/option";
import { type XYKTokenDetailViewProps } from "@/utils/types/organisms.types";
import { truncate } from "@/utils/functions";
import { calculateFeePercentage } from "@/utils/functions/calculate-fees-percentage";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { TokenAvatar } from "@/components/Atoms";
import { Tooltip, Space, Button } from 'antd';
import { handleTabSwitch } from "@/utils/router";
import { useGoodId } from "@/stores/valueGood";
import {
    XYKTokenInformation,
    XYKTokenTimeSeries,
} from "@/components/Molecules";

import { getLpTokenView } from '@/graphql/goods';
import { prettifyCurrencys, prettifyCurrencysFee } from '@/graphql/util';

export const XYKTokenDetailView: React.FC<XYKTokenDetailViewProps> = ({
    chain_name,
    dex_name,
    token_address, value_good_id, chain_id
}) => {
    const router = useRouter();
    const pathname = usePathname()
    const { setGoodId } = useGoodId();
    const [maybeResult, setResult] = useState<Option<TokenV2VolumeWithChartData>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        (async () => {
            setResult(None);
            setErrorMessage(null);
            let response: any;
            try {
                response =
                    await getLpTokenView(
                        value_good_id,
                        token_address,
                        chain_id
                    );
                setResult(new Some(response.items[0]));
                // setIndexResult(new Some(response.items.items[0]));
                setErrorMessage(response.error_message);
                console.log("XYKTokenDetailView ", response);
                // if (response.error) {
                //     throw error;
                // }
            } catch (exception) {
                console.error(exception);
                setResult(None);
                setErrorMessage(response ? response.error_message : "");
            }
        })();
    }, [chain_name, dex_name, token_address, value_good_id]);

    if (errorMessage) {
        return <>{errorMessage}</>;
    }

    if (
        !maybeResult.match({
            None: () => null,
            Some: (result) => result,
        })
    ) {
        return <>{t("common.nodata")}</>;
    }


    const InformationContainer: React.FC<{
        label: string;
        num: any;
        value: any;
        valueSymbol: string;
        title: string;
    }> = ({ label, num, value, title, valueSymbol }) => {
        return (
            <Tooltip placement="top" title={<span>{title}</span>}>
                <div className="flex flex-col gap-1 cursor-pointer min-w-[149px]">
                    <h2 className="font-color-1">{label}</h2>
                    <div className="font-s-8 gap-2">
                        <div>
                            {num}
                        </div>
                        <div style={{ height: value === false ? "27px" : "" }}>
                            {value != "" ? value + " " + valueSymbol : ""}
                        </div>
                    </div>
                </div>
            </Tooltip>
        );
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between gap-4 pt-6">
                <div className="flex items-center gap-4">
                    {maybeResult.match({
                        None: () => (
                            <div className="relative mr-2 flex">
                                <div className="animate-pulse h-20 w-20 rounded-[100%] bg-slate-600" />
                                <div className="animate-pulse absolute left-12 h-20 w-20 rounded-[100%] bg-slate-200" />
                            </div>
                        ),
                        Some: (result) => (
                            <div className="relative mr-2 flex">
                                <TokenAvatar
                                    size={GRK_SIZES.SMALL}
                                    token_url={result.logo_url}
                                />
                            </div>
                        ),
                    })}{" "}
                    {maybeResult.match({
                        None: () => (
                            <div className="ml-8 flex items-center gap-4">
                                <Skeleton size={GRK_SIZES.LARGE} />
                            </div>
                        ),
                        Some: (result) => (
                            <TypographyH4>
                                <Space>
                                    <span>{result.name}</span>
                                    <span className="font-color-1">{result.symbol}</span>
                                </Space>
                            </TypographyH4>
                        ),
                    })}{" "}
                </div>
                <div>
                    <Space>
                        <Button
                            size="large"
                            type="primary"
                            onClick={() => {
                                setGoodId({ invest: { id: token_address }, swap: { id: token_address } });
                                router.push(`${handleTabSwitch("swap", pathname)}`);
                            }}>
                            {t('common.swap')}
                        </Button>
                        <Button
                            size="large"
                            type="primary"
                            onClick={() => {
                                setGoodId({ invest: { id: token_address }, swap: { id: token_address } });
                                router.push(`${handleTabSwitch("invest", pathname)}`);
                            }}>
                            {t('common.invest')}
                        </Button>
                    </Space>
                </div>
            </div>

            <div className="mt-4 flex flex-col gap-4 md:flex-row">
                <div className="flex min-w-[20rem] max-w-[70rem] flex-col gap-2 rounded">
                    <Tooltip placement="top"
                        title={<span>
                            {t("body.goods.level1.price.tip")}</span>}>
                        <div className="flex w-full flex-grow flex-col justify-center gap-2 rounded border p-4 cursor-pointer">
                            <h2 className="font-color-1">
                                {t("body.goods.level1.price")}
                            </h2>
                            <div className="flex items-end gap-2">
                                <span className="text-xl">
                                    {maybeResult.match({
                                        None: () => (
                                            <Skeleton size={GRK_SIZES.MEDIUM} />
                                        ),
                                        Some: (result) => {
                                            return <>{prettifyCurrencys(result.price)}{" "}{result.valueSymbol}</>;
                                        },
                                    })}
                                </span>
                            </div>
                        </div>
                    </Tooltip>
                    <Tooltip placement="top" title={<span>
                        {t("body.goods.level1.24h.tip")}</span>}>
                        <div className="flex w-full flex-grow flex-col justify-center gap-2 rounded border p-4 cursor-pointer">
                            <h2 className="font-color-1">
                                {t("body.goods.level1.24h")}
                            </h2>
                            <div className="flex items-end gap-2">
                                <span className="text-xl">
                                    {maybeResult.match({
                                        None: () => (
                                            <Skeleton size={GRK_SIZES.MEDIUM} />
                                        ),
                                        Some: (result) => {
                                            const valueFormatted = calculateFeePercentage(+result.price_24h);

                                            return (
                                                <div
                                                    className={`text-right ${
                                                        // @ts-ignore
                                                        parseFloat(result.price_24h) > 0 ?
                                                            "text-green-600" : "text-red-600"
                                                        }`}
                                                >
                                                    {valueFormatted}
                                                </div>
                                            )
                                        },
                                    })}
                                </span>
                            </div>
                        </div>
                    </Tooltip>
                    <Tooltip placement="top" title={<span>
                        {t("body.goods.level1.unitfee.tip")}</span>}>
                        <div className="flex w-full flex-grow flex-col justify-center gap-2 rounded border p-4 cursor-pointer">
                            <h2 className="font-color-1">
                                {t("body.goods.level1.unitfee")}
                            </h2>
                            <div className="flex items-end gap-2">
                                <span className="text-xl">
                                    {maybeResult.match({
                                        None: () => (
                                            <Skeleton size={GRK_SIZES.MEDIUM} />
                                        ),
                                        Some: (result) => {
                                            return (
                                                <span>
                                                    {prettifyCurrencysFee(result.unitFee)}
                                                </span>
                                            );
                                        },
                                    })}
                                </span>
                            </div>
                        </div>
                    </Tooltip>
                    <Tooltip placement="top" title={<span>
                        {t("body.goods.level1.apy.tip")}</span>}>
                        <div className="flex w-full flex-grow flex-col justify-center gap-2 rounded border p-4 cursor-pointer">
                            <h2 className="font-color-1">
                                {t("body.goods.level1.apy")}
                            </h2>
                            <div className="flex items-end gap-2">
                                <span className="text-xl">
                                    {maybeResult.match({
                                        None: () => (
                                            <Skeleton size={GRK_SIZES.MEDIUM} />
                                        ),
                                        Some: (result) => {
                                            const valueFormatted = calculateFeePercentage(+result.APY);

                                            return (
                                                <div
                                                    className={`text-right ${
                                                        // @ts-ignore
                                                        parseFloat(result.APY) > 0 ?
                                                            "text-green-600" : "text-red-600"
                                                        }`}
                                                >
                                                    {valueFormatted}
                                                </div>
                                            );
                                        },
                                    })}
                                </span>
                            </div>
                        </div>
                    </Tooltip>
                </div>
                <div className=" flex w-full flex-col gap-4">
                    <div className="">
                        <XYKTokenTimeSeries
                            token_data={maybeResult.match({
                                None: () => null,
                                // @ts-ignore
                                Some: (pool_data) => pool_data.chart_data,
                            })}
                            chain_name={chain_name}
                            dex_name={dex_name}
                            title={t('body.goods.volume.title')}
                            token_address={token_address}
                            value_good_id={""}
                        />
                    </div>
                </div>
            </div>
            <XYKTokenInformation
                // @ts-ignore
                token_data={maybeResult.match({
                    None: () => null,
                    Some: (pool_data) => pool_data,
                })}
                chain_name={chain_name}
                dex_name={dex_name}
                token_address={token_address} value_good_id={""} />

            <div className="flex items-center rounded border p-4">
                <div className="flex flex-grow flex-wrap items-center gap-8">
                    {maybeResult.match({
                        None: () => (
                            <div />
                        ),
                        Some: (result) => {
                            return (
                                <>
                                    <div className="flex flex-grow flex-wrap items-center justify-between gap-8">
                                        <InformationContainer
                                            label={t("body.goods.level2.volume")}
                                            num={`${prettifyCurrencys(result.currentQuantity)}`}
                                            value={`${prettifyCurrencys(result.currentValue)}`}
                                            title={t("body.goods.level2.volume.tip")}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label={t("body.goods.level2.invest")}
                                            num={`${prettifyCurrencys(result.investQuantity)}`}
                                            value={`${prettifyCurrencys(result.investValue)}`}
                                            title={t("body.goods.level2.invest.tip")}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label={t("body.goods.level2.fee")}
                                            num={`${prettifyCurrencys(result.currentFee)}`}
                                            value={`${prettifyCurrencys(result.currentFeeValue)}`}
                                            title={t("body.goods.level2.fee.tip")}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label={t("body.goods.level2.24htrade")}
                                            num={`${prettifyCurrencys(result.tradeQuantity24)}`}
                                            value={`${prettifyCurrencys(result.tradeValue24)}`}
                                            title={t("body.goods.level2.24htrade.tip")}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label={t("body.goods.level2.24hinvest")}
                                            num={`${prettifyCurrencys(result.investQuantity24)}`}
                                            value={`${prettifyCurrencys(result.investValue24)}`}
                                            title={t("body.goods.level2.24hinvest.tip")}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label={t("body.goods.level2.24hfee")}
                                            num={`${prettifyCurrencys(result.fee24)}`}
                                            value={`${prettifyCurrencys(result.feeValue24)}`}
                                            title={t("body.goods.level2.24hfee.tip")}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                    </div>
                                    <div className="flex flex-grow flex-wrap items-center justify-between gap-8">
                                        {/* <div className="flex flex-grow flex-wrap items-center gap-8"> */}
                                        <InformationContainer
                                            label={t("body.goods.level2.totaltrade")}
                                            num={`${prettifyCurrencys(result.totalTradeQuantity)}`}
                                            value={`${prettifyCurrencys(result.totalTradeValue)}`}
                                            title={t("body.goods.level2.totaltrade.tip")}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label={t("body.goods.level2.totalinvest")}
                                            num={`${prettifyCurrencys(result.totalInvestQuantity)}`}
                                            value={`${prettifyCurrencys(result.totalInvestValue)}`}
                                            title={t("body.goods.level2.totalinvest.tip")}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label={t("body.goods.level2.totaldivest")}
                                            num={`${prettifyCurrencys(result.totalDisinvestQuantity)}`}
                                            value={`${prettifyCurrencys(result.totalDisinvestValue)}`}
                                            title={t("body.goods.level2.totaldivest.tip")}
                                            valueSymbol={""}
                                        />
                                        {/* </div>
                                        <div className="flex flex-grow flex-wrap items-center gap-8"> */}
                                        <InformationContainer
                                            label={t("body.goods.level2.totaltradecount")}
                                            num={`${result.totalTradeCount}`}
                                            value={false}
                                            title={t("body.goods.level2.totaltradecount.tip")}
                                            valueSymbol={""}
                                        />
                                        <InformationContainer
                                            label={t("body.goods.level2.totalinvestcount")}
                                            num={`${result.totalInvestCount}`}
                                            value={false}
                                            title={t("body.goods.level2.totalinvestcount.tip")}
                                            valueSymbol={""}
                                        />
                                        <InformationContainer
                                            label={t("body.goods.level2.creator")}
                                            num={`${truncate(result.owner)}`}
                                            value={false}
                                            title={t("body.goods.level2.creator.tip")}
                                            valueSymbol={""}
                                        />
                                        {/* </div> */}
                                    </div>
                                </>);
                        },
                    })}
                </div>
            </div>

            <div className="flex items-center rounded border p-4">
                <div className="flex flex-grow flex-wrap items-center gap-8">
                    {maybeResult.match({
                        None: () => (
                            <div />
                        ),
                        Some: (result) => {
                            return (
                                <>
                                    <div className="flex flex-grow flex-wrap items-center justify-between gap-8">
                                        <InformationContainer
                                            label={t("body.goods.level3.buyfee")}
                                            num={`${prettifyCurrencys(result.buyFee)}` + '%'}
                                            value={""}
                                            title={t("body.goods.level3.buyfee.tip")}
                                            valueSymbol={""}
                                        />
                                        <InformationContainer
                                            label={t("body.goods.level3.sellfee")}
                                            num={`${prettifyCurrencys(result.sellFee)}` + '%'}
                                            value={""}
                                            title={t("body.goods.level3.sellfee.tip")}
                                            valueSymbol={""}
                                        />
                                        <InformationContainer
                                            label={t("body.goods.level3.investfee")}
                                            num={`${prettifyCurrencys(result.investFee)}` + '%'}
                                            value={""}
                                            title={t("body.goods.level3.investfee.tip")}
                                            valueSymbol={""}
                                        />
                                        <InformationContainer
                                            label={t("body.goods.level3.divestfee")}
                                            num={`${prettifyCurrencys(result.divestFee)}` + '%'}
                                            value={""}
                                            title={t("body.goods.level3.divestfee.tip")}
                                            valueSymbol={""}
                                        />
                                        <InformationContainer
                                            label={t("body.goods.level3.swapchips")}
                                            num={`${result.swapChips}`}
                                            value={""}
                                            title={t("body.goods.level3.swapchips.tip")}
                                            valueSymbol={""}
                                        />
                                        <InformationContainer
                                            label={t("body.goods.level3.divestchips")}
                                            num={`${result.divestChips}`}
                                            value={" "}
                                            title={t("body.goods.level3.divestchips.tip")}
                                            valueSymbol={""}
                                        />
                                    </div>
                                </>);
                        },
                    })}
                </div>
            </div>
        </div>
    );
};

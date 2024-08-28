import { TypographyH1 } from "@/components/ui/typography";
import { type TokenV2VolumeWithChartData } from "@/utils/types/XykServiceTypes";
// import { useGoldRush } from "@/utils/store";
import { type Option, Some, None } from "@/utils/option";
import { type XYKTokenDetailViewProps } from "@/utils/types/organisms.types";
import { truncate } from "@/utils/functions";
import { calculateFeePercentage } from "@/utils/functions/calculate-fees-percentage";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { TokenAvatar } from "@/components/Atoms";
import { IconWrapper } from "@/components/Shared";
import { Tooltip, message } from 'antd';
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
    const [maybeResult, setResult] = useState<Option<TokenV2VolumeWithChartData>>(None);
    // const [indexResult, setIndexResult] = useState<Option<TokenV2VolumeWithChartData>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // const { covalentClient } = useGoldRush();

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
        return <>No data found.</>;
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
                <div className="flex flex-col gap-1 cursor-pointer">
                    <h2 className="text-md text-secondary-light">{label}</h2>
                    <div className="gap-2">
                        <div>
                            {num}
                        </div>
                        <div>
                            {value != "" ? value + " " + valueSymbol : ""}
                        </div>
                    </div>
                </div>
            </Tooltip>
        );
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <div className="flex items-center gap-4 pt-6">
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
                                size={GRK_SIZES.MEDIUM}
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
                        <TypographyH1>
                            <span>
                                {result.name}{" "}
                                {`(${result.symbol})`}
                            </span>
                        </TypographyH1>
                    ),
                })}{" "}
            </div>

            <div className="mt-4 flex flex-col gap-4 md:flex-row">
                <div className="flex min-w-[20rem] max-w-[70rem] flex-col gap-2 rounded">
                    <Tooltip placement="top" title={<span>The Metrics is real-time and dynamic, and the calculation formula is (Va/Qa)/(Vb/Qb),a is this good ,b is value good.</span>}>
                        <div className="flex w-full flex-grow flex-col justify-center gap-2 rounded border p-4 cursor-pointer">
                            <h2 className="text-md text-secondary-light">
                                Price
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
                    <Tooltip placement="top" title={<span>The Metrics is (Va/Qa)/(Vb/Qb),a is current state,b is last state before 24 hour.</span>}>
                        <div className="flex w-full flex-grow flex-col justify-center gap-2 rounded border p-4 cursor-pointer">
                            <h2 className="text-md text-secondary-light">
                                24h
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
                    <Tooltip placement="top" title={<span>The Metrics is goods' fee quantity Dividing invest quantity.</span>}>
                        <div className="flex w-full flex-grow flex-col justify-center gap-2 rounded border p-4 cursor-pointer">
                            <h2 className="text-md text-secondary-light">
                                Uint Fee
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
                    <Tooltip placement="top" title={<span>Changes of unit fee in a year.</span>}>
                        <div className="flex w-full flex-grow flex-col justify-center gap-2 rounded border p-4 cursor-pointer">
                            <h2 className="text-md text-secondary-light">
                                APY
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
                            token_address={token_address} value_good_id={""} />
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
                                        {/* <div className="flex flex-grow flex-wrap items-center gap-8"> */}
                                        <InformationContainer
                                            label="Current Volume"
                                            num={`${prettifyCurrencys(result.currentQuantity)}`}
                                            value={`${prettifyCurrencys(result.currentValue)}`}
                                            title={"The Metric is the goods' current volume."}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label="Invest Volume"
                                            num={`${prettifyCurrencys(result.investQuantity)}`}
                                            value={`${prettifyCurrencys(result.investValue)}`}
                                            title={"The Metric is the goods' invest volume."}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label="Fee Volume"
                                            num={`${prettifyCurrencys(result.currentFee)}`}
                                            value={`${prettifyCurrencys(result.currentFeeValue)}`}
                                            title={"The Metric is the goods' fee volume."}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        {/* </div>
                                        <div className="flex flex-grow flex-wrap items-center gap-8"> */}
                                        <InformationContainer
                                            label="24h Net Trade"
                                            num={`${prettifyCurrencys(result.tradeQuantity24)}`}
                                            value={`${prettifyCurrencys(result.tradeValue24)}`}
                                            title={"Chanes of Current Volume in 24 hours."}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label="24h Net Invest"
                                            num={`${prettifyCurrencys(result.investQuantity24)}`}
                                            value={`${prettifyCurrencys(result.investValue24)}`}
                                            title={"Changes of Invest Volume in 24 hours."}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label="24h Net Fee"
                                            num={`${prettifyCurrencys(result.fee24)}`}
                                            value={`${prettifyCurrencys(result.feeValue24)}`}
                                            title={"Changes of Fee Volume in 24 hours."}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        {/* </div> */}
                                    </div>
                                    <div className="flex flex-grow flex-wrap items-center justify-between gap-8">
                                        {/* <div className="flex flex-grow flex-wrap items-center gap-8"> */}
                                        <InformationContainer
                                            label="Total Trade"
                                            num={`${prettifyCurrencys(result.totalTradeQuantity)}`}
                                            value={`${prettifyCurrencys(result.totalTradeValue)}`}
                                            title={"Sum all of  the customers' trade amount."}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label="Total Invest"
                                            num={`${prettifyCurrencys(result.totalInvestQuantity)}`}
                                            value={`${prettifyCurrencys(result.totalInvestValue)}`}
                                            title={"Sum all of the customers' invest amount."}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label="Total Divest"
                                            num={`${prettifyCurrencys(result.totalDisinvestQuantity)}`}
                                            value={`${prettifyCurrencys(result.totalDisinvestValue)}`}
                                            title={"Sum all of the customers' disvest amount."}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        {/* </div>
                                        <div className="flex flex-grow flex-wrap items-center gap-8"> */}
                                        <InformationContainer
                                            label="Total Trade Count"
                                            num={`${result.totalTradeCount}`}
                                            value={""}
                                            title={"Count all of  the customers' trade."}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label="Total Invest Count"
                                            num={`${result.totalInvestCount}`}
                                            value={""}
                                            title={"Count all of the customers' invest."}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label="Creator"
                                            num={`${truncate(result.owner)}`}
                                            value={""}
                                            title={"The goods' creator and owner."}
                                            valueSymbol={`${result.valueSymbol}`}
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
                                            label="Buyfee"
                                            num={`${prettifyCurrencys(result.buyFee)}` + '%'}
                                            value={""}
                                            title={"When customer buy the goods' fee rates."}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label="Sellfee"
                                            num={`${prettifyCurrencys(result.sellFee)}` + '%'}
                                            value={""}
                                            title={"When customer sell the goods' fee rates."}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label="Investfee"
                                            num={`${prettifyCurrencys(result.investFee)}` + '%'}
                                            value={""}
                                            title={"When customer invest the goods' fee rates."}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label="Divestfee"
                                            num={`${prettifyCurrencys(result.divestFee)}` + '%'}
                                            value={""}
                                            title={"When customer divist the goods' fee rates."}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label="Swapchips"
                                            num={`${result.swapChips}`}
                                            value={""}
                                            title={"The chips use when swaping and config by goods' owner."}
                                            valueSymbol={`${result.valueSymbol}`}
                                        />
                                        <InformationContainer
                                            label="Divestchips"
                                            num={`${result.divestChips}`}
                                            value={""}
                                            title={"The chips use  when divist and confing by goods' owner."}
                                            valueSymbol={`${result.valueSymbol}`}
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

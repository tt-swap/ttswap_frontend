import { type Option, None, Some } from "@/utils/option";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AreaChart, BarChart } from "@tremor/react";
import { timestampParser } from "@/utils/functions";
import { TypographyH4 } from "@/components/ui/typography";
import { Skeleton } from "@/components/ui/skeleton";
import {
    CHART_COLORS,
    GRK_SIZES,
    PERIOD,
} from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type XYKOverviewTimeSeriesProps } from "@/utils/types/molecules.types";
import {
    type LiquidityEcosystemChart,
    type UniswapLikeEcosystemCharts,
} from "@/utils/types/XykServiceTypes";
import { capitalizeFirstLetter } from "@/utils/functions/capitalize";

import { ecosystemChartDatas } from '@/graphql/overview';
import { prettifyCurrencys } from '@/graphql/util';


let currencys: string = '';
export const XYKOverviewTimeSeries: React.FC<XYKOverviewTimeSeriesProps> = ({
    chain_name,
    dex_name,
    overview_data,
    displayMetrics = "both",
    value_good_id, chain_id, title
}) => {
    const [maybeResult, setResult] =
        useState<Option<UniswapLikeEcosystemCharts>>(None);
    const [chartData, setChartData] =
        useState<Option<{ [key: string]: string | number | Date }[]>>(None);
    const [period, setPeriod] = useState<PERIOD>(PERIOD.DAYS_7);
    const [timeSeries, setTimeSeries] = useState<string>(
        displayMetrics !== "both" ? displayMetrics : "liquidity"
    );
    const { covalentClient } = useGoldRush();
    useEffect(() => {
        maybeResult.match({
            None: () => null,
            Some: (response) => {
                // 添加空值检查
                if (!response) return;

                currencys = response.quote_currency || '';

                const chart_key = `${timeSeries}_chart_${period}d`;
                const value_key =
                    timeSeries === "price"
                        ? "price"
                        : `${timeSeries}_quote`;

                // 添加安全检查
                const chartData = response[chart_key as keyof typeof response];
                if (!chartData) return;

                const result = (
                    chartData as UniswapLikeEcosystemCharts["liquidity_chart_7d"]
                ).map((x) => {
                    // 添加空值检查
                    if (!x) {
                        const currency = response.quote_currency || '';
                        return {
                            date: '',
                            [`${capitalizeFirstLetter(timeSeries)} (${currency})`]: 0
                        };
                    }

                    const dt = timestampParser(x.dt, "DD MMM YY");
                    return {
                        date: dt,
                        [`${capitalizeFirstLetter(timeSeries)} (${x.quote_currency || ''})`]:
                            x[value_key as keyof LiquidityEcosystemChart] || 0,
                    };
                });
                setChartData(new Some(result));
            },
        });
    }, [maybeResult, period, timeSeries, displayMetrics]);

    useEffect(() => {
        if (overview_data) {
            setResult(new Some(overview_data));
            return;
        }
        (async () => {
            setResult(None);
            try {
                const response = await ecosystemChartDatas(value_good_id, chain_id);
                console.log('response', response);
                // @ts-ignore
                if (response) {
                    setResult(new Some(response as UniswapLikeEcosystemCharts));
                }
            } catch (error) {
                console.error("Error fetching ecosystem chart data:", error);
                setResult(None);
            }
        })();
    }, [overview_data, dex_name, chain_name, displayMetrics, value_good_id, chain_id]);

    useEffect(() => {
        if (displayMetrics === "both") return;
        setTimeSeries(displayMetrics);
    }, [displayMetrics]);

    const body = chartData.match({
        None: () => {
            return (
                <div className="mt-8">
                    <Skeleton size={GRK_SIZES.LARGE} />
                </div>
            );
        },
        Some: (result) => {
            // 添加空值检查
            if (!result || result.length === 0) {
                return (
                    <div className="mt-8">
                        <Skeleton size={GRK_SIZES.LARGE} />
                    </div>
                );
            }

            if (timeSeries === "liquidity") {
                return (
                    <AreaChart
                        className="mt-2"
                        data={result}
                        index="date"
                        yAxisWidth={100}
                        valueFormatter={prettifyCurrencys}
                        categories={[
                            `${capitalizeFirstLetter(timeSeries)} (${currencys})`,
                        ]}
                        colors={CHART_COLORS}
                    />
                );
            }
            return (
                <div>
                    <BarChart
                        className="mt-2"
                        data={result}
                        index="date"
                        yAxisWidth={100}
                        valueFormatter={prettifyCurrencys}
                        categories={[
                            `${capitalizeFirstLetter(timeSeries)} (${currencys})`,
                        ]}
                        colors={CHART_COLORS}
                    />
                </div>
            );
        },
    });

    return (
        <div className="min-h-[20rem] w-full">
            <div className="pb-4">
                <TypographyH4>{`${capitalizeFirstLetter(title || '')} (${currencys})`}</TypographyH4>
            </div>

            <div className="flex justify-between">
                {displayMetrics === "both" && (
                    <div className="flex gap-2">
                        <Button
                            disabled={!maybeResult.isDefined}
                            // @ts-ignore
                            variant={
                                timeSeries === "liquidity"
                                    ? "primary"
                                    : "outline"
                            }
                            onClick={() => setTimeSeries("liquidity")}
                        >
                            Liquidity
                        </Button>
                        <Button
                            disabled={!maybeResult.isDefined}
                            // @ts-ignore
                            variant={
                                timeSeries === "volume" ? "primary" : "outline"
                            }
                            onClick={() => setTimeSeries("volume")}
                        >
                            Volume
                        </Button>
                    </div>
                )}
                <div className="flex gap-2">
                    <Button
                        disabled={!maybeResult.isDefined}
                        // @ts-ignore
                        variant={
                            period === PERIOD.DAYS_7 ? "primary" : "outline"
                        }
                        onClick={() => setPeriod(PERIOD.DAYS_7)}
                    >
                        7 days
                    </Button>
                    <Button
                        disabled={!maybeResult.isDefined}
                        // @ts-ignore
                        variant={
                            period === PERIOD.DAYS_30 ? "primary" : "outline"
                        }
                        onClick={() => setPeriod(PERIOD.DAYS_30)}
                    >
                        30 days
                    </Button>
                </div>
            </div>

            {body}
        </div>
    );
};
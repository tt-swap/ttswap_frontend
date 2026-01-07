import React, { useEffect, useState } from 'react';
import {
    // AreaChart,
    // Area,
    // BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ComposedChart,
    Line,
    // ReferenceLine,
    // Candlestick,
    // ReferenceArea
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface KLineData {
    time: string;
    open: number;
    close: number;
    low: number;
    high: number;
    volume: number;
}

interface KLineChartProps {
    data: KLineData[];
    tokenSymbol: string;
}

const KLineChart: React.FC<KLineChartProps> = ({ data, tokenSymbol }) => {
    const { t } = useTranslation();
    const [processedData, setProcessedData] = useState<any[]>([]);
    const [timeRange, setTimeRange] = useState<{ start: number; end: number }>({ start: 0, end: 100 });

    useEffect(() => {
        if (data && data.length > 0) {
            // 处理数据以适应 Recharts 的需求
            const processed = data.map((item, index) => ({
                time: item.time,
                open: item.open,
                close: item.close,
                high: item.high,
                low: item.low,
                volume: item.volume,
                // 用于蜡烛图的颜色判断
                isRising: item.close >= item.open,
                // 为蜡烛图计算的值
                value: [item.open, item.close, item.low, item.high],
            }));
            setProcessedData(processed);
        } else {
            // 如果没有数据，设置为空数组
            setProcessedData([]);
        }
    }, [data]);

    // 自定义 Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-md">
                    <p className="font-bold">{label}</p>
                    <p>{t("token.k.open")}: {data.open.toFixed(6)} {tokenSymbol}</p>
                    <p>{t("token.k.close")}: {data.close.toFixed(6)} {tokenSymbol}</p>
                    <p>{t("token.k.low")}: {data.low.toFixed(6)} {tokenSymbol}</p>
                    <p>{t("token.k.high")}: {data.high.toFixed(6)} {tokenSymbol}</p>
                    <p>{t("token.k.volume")}: {data.volume.toFixed(2)}</p>
                </div>
            );
        }
        return null;
    };

    // 自定义蜡烛图形状
    const CandleShape = (props: any) => {
        const { x, y, width, height, data } = props;

        // 如果数据不存在，返回 null
        if (!data || !data.value) {
            return null;
        }

        const [open, close, low, high] = data.value;
        const isRising = data.isRising;
        const color = isRising ? '#0fb981' : '#ef4444';

        // 计算蜡烛的主体高度和位置
        const candleHeight = Math.abs(open - close) * 100; // 比例调整
        const candleY = isRising ? y : y - candleHeight;

        // 上影线
        const upperShadowY1 = y - (high - Math.max(open, close)) * 100;
        const upperShadowY2 = candleY;

        // 下影线
        const lowerShadowY1 = candleY + (candleHeight > 0 ? candleHeight : 0);
        const lowerShadowY2 = y + (Math.min(open, close) - low) * 100;

        return (
            <g>
                {/* 上影线 */}
                <line
                    x1={x + width / 2}
                    y1={upperShadowY1}
                    x2={x + width / 2}
                    y2={upperShadowY2}
                    stroke={color}
                    strokeWidth={1}
                />
                {/* 蜡烛主体 */}
                {candleHeight > 0 && (
                    <rect
                        x={x}
                        y={candleY}
                        width={width}
                        height={candleHeight}
                        fill={color}
                        stroke={color}
                    />
                )}
                {/* 当开盘价等于收盘价时，显示一条线 */}
                {candleHeight === 0 && (
                    <line
                        x1={x}
                        y1={candleY}
                        x2={x + width}
                        y2={candleY}
                        stroke={color}
                        strokeWidth={2}
                    />
                )}
                {/* 下影线 */}
                <line
                    x1={x + width / 2}
                    y1={lowerShadowY1}
                    x2={x + width / 2}
                    y2={lowerShadowY2}
                    stroke={color}
                    strokeWidth={1}
                />
            </g>
        );
    };

    // 自定义交易量形状
    const VolumeShape = (props: any) => {
        const { x, y, width, height, data } = props;

        // 如果数据不存在，返回 null
        if (!data || typeof data.isRising === 'undefined') {
            return null;
        }

        const color = data.isRising ? '#0fb981' : '#ef4444';

        return (
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={color}
                stroke={color}
                opacity={0.6}
            />
        );
    };

    return (
        <Card className="h-full">
            <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-base sm:text-lg">
                        {t("token.k.title")}
                    </CardTitle>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setTimeRange({ start: 0, end: 25 })}
                        >
                            25%
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setTimeRange({ start: 0, end: 50 })}
                        >
                            50%
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setTimeRange({ start: 0, end: 75 })}
                        >
                            75%
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setTimeRange({ start: 0, end: 100 })}
                        >
                            100%
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-4">
                <div className="w-full h-[350px] sm:h-[450px] lg:h-[600px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={processedData}
                            margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis
                                dataKey="time"
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                yAxisId="price"
                                domain={['auto', 'auto']}
                                orientation="left"
                                stroke="#8884d8"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                yAxisId="volume"
                                domain={['auto', 'auto']}
                                orientation="right"
                                stroke="#82ca9d"
                                tick={{ fontSize: 12 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            {/* K线图 - 用自定义形状 */}
                            <Bar
                                yAxisId="price"
                                dataKey="value"
                                barSize={8}
                                shape={(props) => CandleShape({ ...props, data: props.payload })}
                                isAnimationActive={false}
                            />
                            {/* 交易量 */}
                            <Bar
                                yAxisId="volume"
                                dataKey="volume"
                                barSize={6}
                                opacity={0.6}
                                shape={(props) => VolumeShape({ ...props, data: props.payload })}
                                isAnimationActive={false}
                            />
                            {/* 价格线 */}
                            <Line
                                yAxisId="price"
                                type="monotone"
                                dataKey="close"
                                stroke="#8884d8"
                                dot={false}
                                activeDot={{ r: 6 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default KLineChart;
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useState, useEffect } from "react";
// import { useValueGood } from "@/stores/valueGood";
// import { useLocalStorage } from "@/utils/LocalStorageManager";

// 使用新的常量
import { COLORS } from "@/utils/constants";
// import { ecosystemChartDatas } from '@/services/graphql/overview';
import { prettifyCurrencys } from '@/services/graphql/util';
import { timestampParser } from "@/utils/timestamp-parser";
import {
  type UniswapLikeEcosystemCharts,
} from "@/types/XykServiceTypes";
import { useTranslation } from 'react-i18next';

// interface TradingStatisticsProps { }

export function TradingStatistics(data: any) {
  const { t } = useTranslation();
  // const { info } = useValueGood();
  // const { ssionChian } = useLocalStorage();
  const [volumePeriod, setVolumePeriod] = useState<
    "7d" | "30d"
  >("7d");
  const [liquidityPeriod, setLiquidityPeriod] = useState<
    "7d" | "30d"
  >("7d");
  const [liquidityData, setLiquidityData] = useState<
    { date: string; liquidity: any }[]
  >([]);
  const [volumeData, setVolumeData] = useState<
    { date: string; volume: any }[]
  >([]);
  const [Data, setData] = useState<UniswapLikeEcosystemCharts>(null);

  useEffect(() => {
    setData(data.data);
    // (async () => {
    //   try {
    //     const data: any = await ecosystemChartDatas(info.id, ssionChian);
    //     setData(data);
    //     console.log(data);
    //   } catch (error) {
    //     setData(null);
    //   }
    // })();
  }, [data]);

  useEffect(() => {
    if (volumePeriod == "7d") {
      setVolumeData(
        Data?.volume_chart_7d.map((item:any) => ({
          date: timestampParser(item.dt, "DD MMM YY"),
          volume: item.volume,
          // volume: prettifyCurrencys(item.volume_quote),
        }))
      );
    } else {
      setVolumeData(
        Data?.volume_chart_30d.map((item:any) => ({
          date: timestampParser(item.dt, "DD MMM YY"),
          volume: item.volume,
          // volume: prettifyCurrencys(item.volume_quote),
        }))
      );
    }
    if (liquidityPeriod == "7d") {
      setLiquidityData(
        Data?.liquidity_chart_7d.map((item:any) => ({
          date: timestampParser(item.dt, "DD MMM YY"),
          liquidity: item.volume,
          // liquidity: prettifyCurrencys(item.liquidity_quote),
        }))
      );
    } else {
      setLiquidityData(
        Data?.liquidity_chart_30d.map((item:any) => ({
          date: timestampParser(item.dt, "DD MMM YY"),
          liquidity: item.volume,
          // liquidity: prettifyCurrencys(item.liquidity_quote),
        }))
      )
    }
    // console.log("----",Data,liquidityData,volumeData);
  }, [Data, volumePeriod, liquidityPeriod]);

  // 自定义工具提示
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            {payload[0].dataKey === "volume"
              ? t("home.chart.volume")
              : t("home.chart.liquidity")}
            : {prettifyCurrencys(payload[0].value)} USDT
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* 总交易量图表 */}
        <Card className="stagger-item hover-lift transition-all duration-300">
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl transition-colors duration-200 hover:text-[#0fb981]">
                {t("home.chart.volume.title")}
                <span className="text-sm font-normal text-muted-foreground">
                  (USDT)
                </span>
              </CardTitle>
              <div className="flex gap-1 self-start sm:self-auto">
                <Button
                  variant={
                    volumePeriod === "7d"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className={`h-7 px-2 sm:px-3 text-xs transition-all duration-200 hover:scale-105 ${volumePeriod === "7d"
                    ? "bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 hover-glow"
                    : "bg-white hover:bg-gray-50 hover:border-[#0fb981] hover:text-[#0fb981]"
                    }`}
                  onClick={() => setVolumePeriod("7d")}
                >
                  7 {t("home.chart.day")}
                </Button>
                <Button
                  variant={
                    volumePeriod === "30d"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className={`h-7 px-2 sm:px-3 text-xs transition-all duration-200 hover:scale-105 ${volumePeriod === "30d"
                    ? "bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 hover-glow"
                    : "bg-white hover:bg-gray-50 hover:border-[#0fb981] hover:text-[#0fb981]"
                    }`}
                  onClick={() => setVolumePeriod("30d")}
                >
                  30 {t("home.chart.day")}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-[#0fb981] transition-transform duration-200 hover:scale-110"></div>
              <span className="text-muted-foreground transition-colors duration-200 hover:text-gray-600">
                Volume (USDT)
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={volumeData}
                  margin={{
                    top: 20,
                    right: 15,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                  // interval={0}
                  // angle={-45}
                  // textAnchor="end"
                  // height={60}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    width={35}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="volume"
                    fill={COLORS.PRIMARY}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 总投资量图表 */}
        <Card className="stagger-item hover-lift transition-all duration-300">
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl transition-colors duration-200 hover:text-[#0fb981]">
                {t("home.chart.liquidity.title")}
                <span className="text-sm font-normal text-muted-foreground">
                  (USDT)
                </span>
              </CardTitle>
              <div className="flex gap-1 self-start sm:self-auto">
                <Button
                  variant={
                    liquidityPeriod === "7d"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className={`h-7 px-2 sm:px-3 text-xs transition-all duration-200 hover:scale-105 ${liquidityPeriod === "7d"
                    ? "bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 hover-glow"
                    : "bg-white hover:bg-gray-50 hover:border-[#0fb981] hover:text-[#0fb981]"
                    }`}
                  onClick={() => setLiquidityPeriod("7d")}
                >
                  7 {t("home.chart.day")}
                </Button>
                <Button
                  variant={
                    liquidityPeriod === "30d"
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className={`h-7 px-2 sm:px-3 text-xs transition-all duration-200 hover:scale-105 ${liquidityPeriod === "30d"
                    ? "bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 hover-glow"
                    : "bg-white hover:bg-gray-50 hover:border-[#0fb981] hover:text-[#0fb981]"
                    }`}
                  onClick={() => setLiquidityPeriod("30d")}
                >
                  30 {t("home.chart.day")}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-[#0fb981] transition-transform duration-200 hover:scale-110"></div>
              <span className="text-muted-foreground transition-colors duration-200 hover:text-gray-600">
                Liquidity (USDT)
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={liquidityData}
                  margin={{
                    top: 20,
                    right: 15,
                    left: 10,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                  // interval={0}
                  // angle={-45}
                  // textAnchor="end"
                  // height={60}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    width={35}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient
                      id="liquidityGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={COLORS.PRIMARY}
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor={COLORS.PRIMARY}
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="liquidity"
                    stroke={COLORS.PRIMARY}
                    strokeWidth={2}
                    fill="url(#liquidityGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
}

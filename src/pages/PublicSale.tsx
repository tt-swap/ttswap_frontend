import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Target,
  CheckCircle,
  AlertCircle,
  History, Eye
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useWallet from "@/hooks/useWallet";

import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Tooltip } from 'antd';

import Message from '@/components/MessModal/index';
import { useValueCionLogo } from "@/hooks/useValueCionLogo";
import { TokenAvatar } from "@/components/common/TokenAvatar";
import { useValueGood } from "@/stores/valueGood";
import { useLocalStorage } from "@/utils/LocalStorageManager";
import { GRK_SIZES } from "@/types/common";
import { publicSaleData } from '@/services/graphql';
import { prettifyCurrencys } from '@/services/graphql/util';
import { timestampParser } from "@/utils/timestamp-parser";
import { useAccount } from 'wagmi';
import { useTranslation } from 'react-i18next';
import { useMuneName } from "@/stores/menu";
import { useLanguage } from '@/hooks/useLanguage';


// 公售阶段数据
const salePhases = [
  {
    id: 1,
    phase: "1",
    target: 87500, // 8.75万美元
    price: 0.04,
    tokens: 2250000, // 225万{t("sale.piece")}
    status: "active",
    raised: 0,
    participants: 0,
  },
  {
    id: 2,
    phase: "2",
    target: 75000, // 7.5万美元
    price: 0.05,
    tokens: 1500000, // 150万{t("sale.piece")}
    status: "upcoming",
    raised: 0,
    participants: 0,
  },
  {
    id: 3,
    phase: "3",
    target: 87500, // 8.75万美元
    price: 0.06,
    tokens: 1250000, // 125万{t("sale.piece")}
    status: "upcoming",
    raised: 0,
    participants: 0,
  },
];

// 项目总体信息
const projectInfo = {
  totalSupply: 50000000, // 5000万
  publicSalePercentage: 10, // 10%
  publicSaleTokens: 5000000, // 500万{t("sale.piece")}
  totalTarget: 250000, // 25万美元
  // currentPhase: 2,
};

// 用户公售记录模拟数据
const mockPublicSaleRecords = [];

export default function PublicSale() {
  const { t } = useTranslation();
  const { ttsPublic, handleAddToken } = useWallet();

  const { info } = useValueGood();
  const { ssionChian } = useLocalStorage();
  const { isConnected, address } = useAccount();
  const [investmentAmount, setInvestmentAmount] = useState("");

  const [spinning, setSpinning] = useState(false);
  const [open, setOpen] = useState(false);
  const [mesStatus, setMesStatus] = useState("");
  const [mesTitle, setMesTitle] = useState("");
  const [tokenLogo, setTokenLogo] = useState<string | undefined>(useValueCionLogo(info));

  const [selectedPhase, setSelectedPhase] = useState(1);
  const [publicSaleRecords, setPublicSaleRecords] = useState([]);
  const [publicSalePhases, setPublicSalePhases] = useState(salePhases);
  const [raiseT, setRaiseT] = useState(0);
  const [sellT, setSellT] = useState(0);
  const { name, setName } = useMuneName();
  const { currentLanguage, changeLanguage } = useLanguage();
  useEffect(() => {
    setName('publicSale');
  }, []);



  useEffect(() => {
    setTokenLogo(useValueCionLogo(info));
  }, [info.symbol]);


  useEffect(() => {
    (async () => {

      const data: any = await publicSaleData(ssionChian);
      console.log("09--", data);
      if (data.items.length > 0) {
        setPublicSaleRecords(data.items);
        setRaiseT(data.totalU);
        setSellT(data.totalT);
      } else {
        setPublicSaleRecords(mockPublicSaleRecords);
        setRaiseT(2550);
        setSellT(63750);
      }
    })()
  }, [ssionChian]);

  useEffect(() => {
    console.log("09--00", raiseT);
    let a = [...publicSalePhases];
    a[0].phase = t("sale.phase1");
    a[1].phase = t("sale.phase2");
    a[2].phase = t("sale.phase3");
    if (raiseT <= a[0].target) {
      a[0].status = "active";
      a[0].raised = raiseT;
      a[0].participants = publicSaleRecords.length;
    } else if (raiseT > a[0].target && raiseT <= (a[0].target + a[1].target)) {
      a[0].status = "completed";
      a[1].status = "active";
      a[1].raised = raiseT - a[0].target;
      a[0].raised = a[0].target;
      a[0].participants = publicSaleRecords.filter((item) => item.phase === 1).length;
      a[1].participants = publicSaleRecords.filter((item) => item.phase === 2).length;
    } else {
      a[0].status = "completed";
      a[1].status = "completed";
      a[2].status = "active";
      a[0].raised = a[0].target;
      a[1].raised = a[1].target;
      a[2].raised = raiseT - (a[0].target + a[1].target);
      a[0].participants = publicSaleRecords.filter((item) => item.phase === 1).length;
      a[1].participants = publicSaleRecords.filter((item) => item.phase === 2).length;
      a[2].participants = publicSaleRecords.filter((item) => item.phase === 3).length;
    }
    setPublicSalePhases(a);
  }, [raiseT,currentLanguage]);

  // 超小尺寸USDT图标渲染函数 (73.5%大小 = 75% * 98%)
  const renderUsdtIconExtraSmall = () => {
    return (
      <span className="flex items-center gap-1">
        <span className="w-[14.7px] h-[14.7px] rounded-full flex items-center justify-center text-white font-medium text-[9.8px] bg-[#26a17b]">
          <TokenAvatar
            token_url={tokenLogo}
            size={GRK_SIZES.SMALL}
          />
        </span>
      </span>
    );
  };
  const currentPhase = publicSalePhases.find(
    (phase) => phase.id === selectedPhase,
  );
  const totalRaised = publicSalePhases.reduce(
    (sum, phase) => sum + phase.raised,
    0,
  );
  const totalParticipants = publicSalePhases.reduce(
    (sum, phase) => sum + phase.participants,
    0,
  );

  // 计算可购买的代币数量
  const calculateTokens = (usdAmount: string) => {
    if (!currentPhase || !usdAmount) return 0;
    return parseFloat(usdAmount) / currentPhase.price;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US"
      // , {
      //   style: "currency",
      //   currency: "USD",
      //   minimumFractionDigits: 0,
      //   maximumFractionDigits: 0,
      // }
    ).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "active":
        return "bg-[#0fb981]/10 text-[#0fb981] border-[#0fb981]/20";
      case "upcoming":
        return "bg-gray-100 text-gray-600 border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getPhaseStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "active":
        return <TrendingUp className="h-4 w-4" />;
      case "upcoming":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  // 获取公售记录状态颜色
  const getRecordStatusColor = (status: string) => {
    switch (status) {
      case "已完成":
        return "bg-green-100 text-green-800";
      case "已确认":
        return "bg-blue-100 text-blue-800";
      case "处理中":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // 格式化时间
  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 格式化交易哈希
  const formatTxHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
  };

  const publicSale = async () => {
    setSpinning(true);
    const a = await ttsPublic(Number(investmentAmount) * 1e6);
    console.log(a);
    if (a === true) {
      setMesStatus("success");
      setMesTitle(t("common.mess.success"));
      setOpen(true);
    } else {
      setMesStatus("error");
      setMesTitle(t("common.mess.error") + a);
      setOpen(true);
    }
    setSpinning(false);
  };

  const walletAddTts = async () => {
    setSpinning(true);
    const a = await handleAddToken();
    console.log(a);
    // if (a === true) {
    //   setMesStatus("success");
    //   setMesTitle("成功");
    //   setOpen(true);
    // } else {
    //   setMesStatus("error");
    //   setMesTitle("失败" + a);
    //   setOpen(true);
    // }
    setSpinning(false);
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
      <div className="animate-fade-in">
        <div className="mb-4 sm:mb-6 animate-slide-in-left">
          <h1 className="mb-2 text-xl sm:text-2xl">
            {t("sale.title")}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {t("sale.title.desc")}
          </p>
        </div>

        <div className="space-y-6 animate-fade-in">
          {/* 项目概览 */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Card className="stagger-item hover-lift transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#0fb981]/10 rounded-lg transition-transform duration-200 hover:scale-110">
                    <Target className="h-5 w-5 text-[#0fb981]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground transition-colors duration-200 hover:text-gray-600">
                      {t("sale.mod1.label1")}
                    </p>
                    <p className="font-medium transition-colors duration-200 hover:text-[#0fb981] flex items-center gap-1">
                      {formatCurrency(projectInfo.totalTarget)}
                      {renderUsdtIconExtraSmall()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stagger-item hover-lift transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg transition-transform duration-200 hover:scale-110">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground transition-colors duration-200 hover:text-gray-600">
                      {t("sale.mod1.label2")}
                    </p>
                    <p className="font-medium transition-colors duration-200 hover:text-blue-600 flex items-center gap-1">
                      {formatCurrency(raiseT)}
                      {renderUsdtIconExtraSmall()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stagger-item hover-lift transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg transition-transform duration-200 hover:scale-110">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground transition-colors duration-200 hover:text-gray-600">
                      {t("sale.mod1.label3")}
                    </p>
                    <p className="font-medium transition-colors duration-200 hover:text-purple-600">
                      {publicSaleRecords?.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="stagger-item hover-lift transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg transition-transform duration-200 hover:scale-110">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground transition-colors duration-200 hover:text-gray-600">
                      {t("sale.mod1.label4")}
                    </p>
                    <p className="font-medium transition-colors duration-200 hover:text-orange-600">
                      {(
                        (raiseT / projectInfo.totalTarget) * 100
                      ).toFixed(1)}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 总体进度条 */}
          <Card className="hover-lift transition-all duration-300 animate-slide-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 transition-colors duration-200 hover:text-[#0fb981]">
                <TrendingUp className="h-5 w-5 text-[#0fb981] transition-transform duration-200 hover:scale-110" />
                {t("sale.mod2.label1")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">{t("sale.raised")}: {formatCurrency(totalRaised)}
                    {renderUsdtIconExtraSmall()}</span>
                  <span className="flex items-center gap-1">
                    {t("sale.goal")}: {formatCurrency(projectInfo.totalTarget)}
                    {renderUsdtIconExtraSmall()}
                  </span>
                </div>
                <Progress
                  value={
                    (totalRaised / projectInfo.totalTarget) * 100
                  }
                  className="h-3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    {t("sale.mod2.label2")}:{" "}
                  </span>
                  <span className="font-medium">
                    {formatNumber(projectInfo.totalSupply)} {t("sale.piece")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    {t("sale.mod2.label3")}:{" "}
                  </span>
                  <span className="font-medium">
                    {projectInfo.publicSalePercentage}% (
                    {formatNumber(projectInfo.publicSaleTokens)} {t("sale.piece")})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 公售阶段 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {publicSalePhases?.map((phase, index) => (
              <Card
                key={phase.id}
                className={`stagger-item cursor-pointer transition-all duration-300 hover-lift ${selectedPhase === phase.id
                  ? "ring-2 ring-[#0fb981] border-[#0fb981] hover-glow"
                  : "hover:border-[#0fb981]/30 hover:shadow-md"
                  }`}
                onClick={() => setSelectedPhase(phase.id)}
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {phase.phase}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className={`${getPhaseStatusColor(phase.status)} flex items-center gap-1`}
                    >
                      {getPhaseStatusIcon(phase.status)}
                      {phase.status === "completed" && t("sale.status.completed")}
                      {phase.status === "active" && t("sale.status.active")}
                      {phase.status === "upcoming" && t("sale.status.upcoming")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        {t("sale.raised")}: {formatCurrency(phase.raised)}
                        {renderUsdtIconExtraSmall()}
                      </span>
                      <span className="flex items-center gap-1">
                        {t("sale.goal")}: {formatCurrency(phase.target)}
                        {renderUsdtIconExtraSmall()}
                      </span>
                    </div>
                    <Progress
                      value={(phase.raised / phase.target) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">
                        {t("sale.price")}
                      </p>
                      <p className="font-medium flex items-center gap-1">{phase.price}
                        {renderUsdtIconExtraSmall()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        {t("sale.quantity")}
                      </p>
                      <p className="font-medium">
                        {formatNumber(phase.tokens)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        {t("sale.participants")}
                      </p>
                      <p className="font-medium">
                        {formatNumber(phase.participants)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground"> {t("sale.progress")}</p>
                      <p className="font-medium">
                        {(
                          (phase.raised / phase.target) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 投资表单 */}
          {currentPhase && currentPhase.status === "active" && (
            <Card className="hover-lift transition-all duration-300 animate-slide-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 transition-colors duration-200 hover:text-[#0fb981]">
                  <DollarSign className="h-5 w-5 text-[#0fb981] transition-transform duration-200 hover:scale-110" />
                  {t("sale.mod3.label1")} {currentPhase.phase} {t("sale.mod3.label1-1")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="investment">
                          {t("sale.mod3.buy")} (USDT)
                        </Label>
                        <Button
                          className="bg-[#0fb981] hover:bg-[#22c55e] text-white btn-modern hover-glow transition-all duration-300"
                          disabled={!isConnected}
                          onClick={() =>
                            walletAddTts()
                          }
                        >
                          {t("sale.mod3.wallet")}
                        </Button>
                      </div>
                      <Input
                        id="investment"
                        type="number"
                        placeholder={t("sale.mod3.buy")}
                        value={investmentAmount}
                        max={10000}
                        min={0}
                        onChange={(e) =>
                          setInvestmentAmount(e.target.value)
                        }
                      />
                    </div>

                    {investmentAmount && (
                      <div className="p-4 bg-[#0fb981]/5 rounded-lg border border-[#0fb981]/20">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">
                              {t("sale.mod3.invest")}
                            </p>
                            <p className="font-medium flex items-center gap-1">
                              {investmentAmount}
                              {renderUsdtIconExtraSmall()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              {t("sale.mod3.obtain")}
                            </p>
                            <p className="font-medium">
                              {formatNumber(
                                calculateTokens(investmentAmount),
                              )}{" "}
                              {t("sale.piece")}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              {t("sale.price")}
                            </p>
                            <p className="font-medium flex items-center gap-1">
                              {currentPhase.price}
                              {renderUsdtIconExtraSmall()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              {t("sale.mod3.stage")}
                            </p>
                            <p className="font-medium">
                              {currentPhase.phase}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full bg-[#0fb981] hover:bg-[#22c55e] text-white btn-modern hover-glow transition-all duration-300"
                      disabled={
                        !investmentAmount ||
                        parseFloat(investmentAmount) < 100 ||
                        parseFloat(investmentAmount) > 10000
                      }
                      onClick={() =>
                        publicSale()
                      }
                    >
                      {t("sale.mod3.bnt")}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-medium mb-3">{t("sale.mod3.Instructions")}</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#0fb981] rounded-full"></div>
                          <span>{t("sale.mod3.Instructions.label1")}</span>
                        </div>
                        {/* <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#0fb981] rounded-full"></div>
                          <span>{t("sale.mod3.Instructions.label2")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#0fb981] rounded-full"></div>
                          <span>{t("sale.mod3.Instructions.label3")}</span>
                        </div> */}
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium mb-2 text-blue-800">
                        {t("sale.mod3.tip")}
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• {t("sale.mod3.tip.label1")}: 100(USDT)</li>
                        <li>• {t("sale.mod3.tip.label2")}: 10,000(USDT)</li>
                        <li>• {t("sale.mod3.tip.label3")}</li>
                        <li>• {t("sale.mod3.tip.label4")}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 我的公售记录 */}
          <Card className="hover-lift transition-all duration-300 animate-slide-in-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 transition-colors duration-200 hover:text-[#0fb981]">
                <History className="h-5 w-5 text-[#0fb981] transition-transform duration-200 hover:scale-110" />
                {t("sale.mod4.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {publicSaleRecords?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t("sale.mod4.table.nottip1")}</p>
                  <p className="text-sm mt-1">
                  {t("sale.mod4.table.nottip2")}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* 统计信息 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        {t("sale.mod4.label1")}
                      </p>
                      <p className="font-medium text-lg flex items-center justify-center gap-1">
                        {formatNumber(raiseT)}
                        {renderUsdtIconExtraSmall()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        {t("sale.mod4.label2")}
                      </p>
                      <p className="font-medium text-lg">
                        {formatNumber(sellT)}{" "}
                        {t("sale.piece")}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        {t("sale.mod4.label3")}
                      </p>
                      <p className="font-medium text-lg">
                        {publicSaleRecords?.length}
                      </p>
                    </div>
                  </div>

                  {/* 记录表格 */}
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="text-center w-[40px] h-[34px] px-2 py-[5.5px]">
                            {t("common.table.id")}
                          </TableHead>
                          <TableHead className="text-left h-[34px] px-2 py-[5.5px]">
                          {t("sale.mod4.table.type")}
                          </TableHead>
                          <TableHead className="text-left h-[34px] px-2 py-[5.5px]">
                          {t("sale.mod4.table.time")}
                          </TableHead>
                          <TableHead className="text-right h-[34px] px-2 py-[5.5px]">
                          {t("sale.mod4.table.amount")}
                          </TableHead>
                          <TableHead className="text-right h-[34px] px-2 py-[5.5px]">
                          {t("sale.mod4.table.value")}
                          </TableHead>
                          <TableHead className="text-right h-[34px] px-2 py-[5.5px]">
                          {t("sale.mod4.table.obtain")}
                          </TableHead>
                          <TableHead className="text-center h-[34px] px-2 py-[5.5px]">
                          {t("common.actions")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {publicSaleRecords?.map(
                          (record, index) => (
                            <TableRow
                              key={record.id}
                              className="stagger-item hover:bg-muted/30 transition-all duration-300 group"
                            >
                              <TableCell className="text-center align-middle px-2 py-[5.5px]">
                                <div className="font-medium">
                                  {index + 1}
                                </div>
                              </TableCell>
                              <TableCell className="px-2 py-[5.5px]">
                                <div className="font-medium">
                                  {record.phase === 1 && publicSalePhases[0].phase}
                                  {record.phase === 2 && publicSalePhases[1].phase}
                                  {record.phase === 3 && publicSalePhases[2].phase}
                                </div>
                              </TableCell>
                              <TableCell className="px-2 py-[5.5px]">
                                <div className="font-medium text-sm">
                                  {formatDateTime(
                                    record.create_time,
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-right px-2 py-[5.5px]">
                                <div className="font-medium">
                                  {formatNumber(
                                    record.usdtamount,
                                  )}{" "}{info.symbol}
                                </div>
                              </TableCell>
                              <TableCell className="text-right px-2 py-[5.5px]">
                                <div className="font-medium">
                                  {record.phase === 1 && publicSalePhases[0].price}
                                  {record.phase === 2 && publicSalePhases[1].price}
                                  {record.phase === 3 && publicSalePhases[2].price}
                                  {" "}{info.symbol}
                                </div>
                              </TableCell>
                              <TableCell className="text-right px-2 py-[5.5px]">
                                <div className="font-medium">
                                  {formatNumber(
                                    record.ttsamount,
                                  )}{" "}
                                  {t("sale.piece")}
                                </div>
                              </TableCell>
                              {/* <TableCell className="text-center px-2 py-[5.5px]">
                                <Badge
                                  variant="outline"
                                  className={`${getRecordStatusColor(record.status)} border-0`}
                                >
                                  {record.status}
                                </Badge>
                              </TableCell> */}
                              <TableCell className="text-center px-2 py-[5.5px]">
                                <Button
                                  onClick={() => window.open(`${record.hash}`, '_blank')}
                                  size="sm"
                                  className="h-7 px-2 text-xs bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm transition-colors"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ),
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

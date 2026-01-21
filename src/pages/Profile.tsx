import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TokenTable } from "@/components/tables/TokenTable";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share, Plus, ChevronRight, X } from "lucide-react";
import { PortfolioOverview } from "@/components/business/PortfolioOverview";
import { InvestmentTable } from "@/components/tables/InvestmentTable";
import { TransactionRecords } from "@/components/tables/TransactionRecords";
import { ReferralTable } from "@/components/tables/ReferralTable";
import { CommissionTable } from "@/components/tables/CommissionTable";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    CreateTokenDialog,
    SwapDialog,
    WithdrawDialog,
    UpdateTokenDialog,
    // Freeze
} from "@/components/dialogs";
import { useTranslation } from 'react-i18next';
import { myIndexes, refereesDatas } from '@/services/graphql/account';
import { useValueGood } from "@/stores/valueGood";
import { useLocalStorage } from "@/utils/LocalStorageManager";
import { useAccount } from 'wagmi';
import { useMuneName } from "@/stores/menu";
import { message } from 'antd';


export default function Profile() {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const { ssionChian } = useLocalStorage();
    const { isConnected, address } = useAccount();
    const [messageApi, contextHolder] = message.useMessage();
    const [referees, setReferees] = useState(0);
    const { info } = useValueGood();
    // const [spinning, setSpinning] = useState(false);


    const [activeSubTab, setActiveSubTab] =
        useState("investment");
    const [isCreateTokenDialogOpen, setIsCreateTokenDialogOpen] =
        useState(false);
    const [isSwapDialogOpen, setIsSwapDialogOpen] =
        useState(false);
    const [freezeDialogOpen, setFreezeDialogOpen] =
        useState(false);
    const [swapDialogTab, setSwapDialogTab] = useState<"invest" | "swap">("swap");
    const [selectedToken, setSelectedToken] = useState(null);
    const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] =
        useState(false);
    const [selectedInvestmentGroup, setSelectedInvestmentGroup] = useState(0);
    const [mobileTabSheetOpen, setMobileTabSheetOpen] =
        useState(false);
    const [mobileTabSheetContent, setMobileTabSheetContent] =
        useState<string>("");
    const [isUpdateTokenDialogOpen, setIsUpdateTokenDialogOpen] =
        useState(false);
    const [selectedUpdateToken, setSelectedUpdateToken] = useState(null);
    const { name, setName } = useMuneName();
    const [myInfo, setMyInfo] = useState(null);

    useEffect(() => {
        setName('profile');
    }, []);

    useEffect(() => {
        (async () => {
            const result = await myIndexes(info.id, address, ssionChian);
            setMyInfo(result);
            // const data = await refereesDatas(address, ssionChian);
            // @ts-ignore
            setReferees(result.referralnum);
            // console.log("referees：address：",referees,data)
        })();
    }, [address, ssionChian, info.id]);


    function fallbackCopyTextToClipboard(text: string): void {
        const textarea = document.createElement('textarea');
        textarea.style.position = 'fixed'; // 防止滚动条
        textarea.style.top = '0';
        textarea.style.left = '0';
        textarea.style.opacity = '0';
        textarea.value = text;
        document.body.appendChild(textarea);

        try {
            // 尝试复制文本
            textarea.select();
            document.execCommand('copy');
            // alert('文本已复制到剪贴板（回退方案）');
        } catch (err) {
            // console.error('复制文本时出错（回退方案）:', err);
            // alert('复制文本时出错，请尝试手动复制');
        }

        document.body.removeChild(textarea);
    }

    function mess() {
        messageApi.open({
            type: 'success',
            content: t('common.mess.copy'),
        });
    }

    // 处理代币交换点击
    const handleTokenSwap = (
        token: any
    ) => {
        setSelectedToken(token);
        setSwapDialogTab("swap");
        setIsSwapDialogOpen(true);
    };

    // 处理代币投资点击
    const handleTokenInvest = (
        token: any,
    ) => {
        setSelectedToken(token);
        setSwapDialogTab("invest");
        setIsSwapDialogOpen(true);
    };

    // 处理代币更新点击
    const handleTokenUpdate = (
        token: any,
    ) => {
        setSelectedUpdateToken(token);
        setIsUpdateTokenDialogOpen(true);
    };

    // 处理代币更新点击
    const handleFreeze = (
        token: any,
    ) => {
        setSelectedToken(token);
        setFreezeDialogOpen(true);
    };


    // 处理撤资点击
    const handleWithdrawClick = (token: any) => {
        setSelectedInvestmentGroup(token);
        setIsWithdrawDialogOpen(true);
    };


    // 处理移动端页签点击
    const handleMobileTabClick = (
        tabValue: string
    ) => {
        setMobileTabSheetContent(tabValue);
        setMobileTabSheetOpen(true);
    };

    // 渲染移动端页签内容
    const renderMobileTabContent = () => {
        switch (mobileTabSheetContent) {
            case "investment":
                return (
                    <InvestmentTable
                        // data={mockInvestmentData}
                        wallet_address={address}
                        onWithdrawClick={handleWithdrawClick}
                        onTokenClick={handleTokenRowClick}
                    />
                );
            case "tokens":
                return (
                    <TokenTable
                        onSwapClick={handleTokenSwap}
                        onInvestClick={handleTokenInvest}
                        onFreezeClick={handleFreeze}
                        onTokenClick={handleTokenRowClick}
                        onUpdateClick={handleTokenUpdate}
                        showUpdateButton={true}
                        valueId={info.id}
                        chainId={ssionChian}
                        wallet_address={address}
                    />
                );
            case "idle":
                return <CommissionTable
                    wallet_address={address}
                    onTokenClick={handleTokenRowClick} />;
            case "records":
                return (
                    <TransactionRecords
                        wallet_address={address}
                    />
                );
            case "referrals":
                return <ReferralTable
                    wallet_address={address} />;
            default:
                return null;
        }
    };

    // 获取页签标题
    const getTabTitle = (tabValue: string) => {
        switch (tabValue) {
            case "investment":
                return t('account.tabs.proof');
            case "tokens":
                return t('account.tabs.goods');
            case "idle":
                return t('account.tabs.commission');
            case "records":
                return t('account.tabs.transactions');
            case "referrals":
                return t('account.tabs.referees');
            default:
                return "";
        }
    };


    // 处理代币行点击跳转到TokenProfile
    const handleTokenRowClick = (token: string) => {
        navigate('/tokens/' + token);
    };

    return (
        <div className="animate-fade-in">
            {contextHolder}
            <div className="mb-3 flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0 animate-slide-in-left">
                <div>
                    <h1 className="mb-[0.175rem] text-xl sm:text-2xl">
                        {t("account.title")}
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        {t("account.title.desc")}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3 items-center w-full sm:w-auto">
                    <Button
                        size="sm"
                        className="h-8 px-3 sm:px-4 bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm text-xs sm:text-sm btn-modern hover-glow transition-all duration-300"
                        onClick={() =>
                            navigate('/publicSale')
                        }
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        {t('header.menu.publicSale')}
                    </Button>
                    <Button
                        disabled={!isConnected}
                        size="sm"
                        className="h-8 px-3 sm:px-4 bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm text-xs sm:text-sm btn-modern hover-glow transition-all duration-300"
                        onClick={() =>
                            setIsCreateTokenDialogOpen(true)
                        }
                    >
                        <Plus className="h-3 w-3 mr-1" />
                        {t('account.add.token')}
                    </Button>
                    <Button
                        disabled={!isConnected}
                        size="sm"
                        className="h-8 px-3 sm:px-4 bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm text-xs sm:text-sm btn-modern hover-glow transition-all duration-300"
                        onClick={() => {
                            if (navigator.clipboard) {
                                navigator.clipboard.writeText(window.location.host + "?" + address);
                                mess();
                            } else {
                                fallbackCopyTextToClipboard(window.location.host + "?" + address);
                                mess();
                            }
                        }}
                    >
                        <Share className="h-3 w-3 mr-1" />
                        {t('account.bnt.share')}
                    </Button>
                </div>
            </div>

            <div className="mb-2.5">
                <PortfolioOverview datas={myInfo} />
            </div>
            <div className="mb-6 animate-slide-in-left">
                <h1 className="mb-[0.175rem]">
                    {t('account.tabs.title')}
                </h1>
                <p className="text-muted-foreground">
                    {t('account.tabs.title.desc')}
                </p>
            </div>

            <div className="mb-2.5">
                {/* 桌面端标签页 */}
                <div className="hidden sm:block">
                    <Tabs
                        value={activeSubTab}
                        onValueChange={setActiveSubTab}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-5 max-w-4xl scale-90 origin-left">
                            <TabsTrigger value="investment">
                                {t('account.tabs.proof')}
                            </TabsTrigger>
                            <TabsTrigger value="tokens">
                                {t('account.tabs.goods')}
                            </TabsTrigger>
                            <TabsTrigger value="idle">
                                {t('account.tabs.commission')}
                            </TabsTrigger>
                            <TabsTrigger value="records">
                                {t('account.tabs.transactions')}
                            </TabsTrigger>
                            <TabsTrigger
                                value="referrals"
                                className="relative"
                            >
                                {t('account.tabs.referees')}
                                <Badge
                                    variant="secondary"
                                    className="ml-1 h-5 min-w-5 text-xs bg-[#0fb981] text-white"
                                >
                                    {referees}
                                </Badge>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value="investment"
                            className="mt-6"
                        >
                            <InvestmentTable
                                // data={mockInvestmentData}
                                wallet_address={address}
                                onWithdrawClick={handleWithdrawClick}
                                onTokenClick={handleTokenRowClick}
                            />
                        </TabsContent>

                        <TabsContent
                            value="tokens"
                            className="mt-6"
                        >
                            <TokenTable
                                onSwapClick={handleTokenSwap}
                                onInvestClick={handleTokenInvest}
                                onTokenClick={handleTokenRowClick}
                                onUpdateClick={handleTokenUpdate}
                                onFreezeClick={handleFreeze}
                                showUpdateButton={true}
                                valueId={info.id}
                                chainId={ssionChian}
                                wallet_address={address}
                            />
                        </TabsContent>

                        <TabsContent
                            value="idle"
                            className="mt-6"
                        >
                            <div>
                                <CommissionTable
                                    wallet_address={address}
                                    onTokenClick={handleTokenRowClick}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent
                            value="records"
                            className="mt-6"
                        >
                            <div>
                                <TransactionRecords
                                    wallet_address={address}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent
                            value="referrals"
                            className="mt-6"
                        >
                            <div>
                                <ReferralTable
                                    wallet_address={address}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* 移动端按钮列表 */}
                <div className="sm:hidden space-y-3">
                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full justify-between h-12 bg-white border-gray-200 hover:bg-gray-50 hover:border-[#0fb981]"
                            onClick={() =>
                                handleMobileTabClick("investment")
                            }
                        >
                            <span className="text-base">
                                {t('account.tabs.proof')}
                            </span>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full justify-between h-12 bg-white border-gray-200 hover:bg-gray-50 hover:border-[#0fb981]"
                            onClick={() =>
                                handleMobileTabClick("tokens")
                            }
                        >
                            <span className="text-base">{t('account.tabs.goods')}</span>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full justify-between h-12 bg-white border-gray-200 hover:bg-gray-50 hover:border-[#0fb981]"
                            onClick={() =>
                                handleMobileTabClick("idle")
                            }
                        >
                            <span className="text-base">{t('account.tabs.commission')}</span>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full justify-between h-12 bg-white border-gray-200 hover:bg-gray-50 hover:border-[#0fb981]"
                            onClick={() =>
                                handleMobileTabClick("records")
                            }
                        >
                            <span className="text-base">{t('account.tabs.transactions')}</span>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full justify-between h-12 bg-white border-gray-200 hover:bg-gray-50 hover:border-[#0fb981]"
                            onClick={() =>
                                handleMobileTabClick("referrals")
                            }
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-base">
                                    {t('account.tabs.referees')}
                                </span>
                                <Badge
                                    variant="secondary"
                                    className="h-5 min-w-5 text-xs bg-[#0fb981] text-white"
                                >
                                    {referees}
                                </Badge>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        </Button>
                    </div>
                </div>

                {/* 移动端内容Sheet */}
                <Sheet
                    open={mobileTabSheetOpen}
                    onOpenChange={setMobileTabSheetOpen}
                >
                    <SheetContent
                        side="bottom"
                        className="h-[85vh] px-4 py-6"
                    >
                        <SheetHeader className="mb-0 -mb-2">
                            <SheetTitle className="text-lg mb-0">
                                {getTabTitle(mobileTabSheetContent)}
                            </SheetTitle>
                            {/* <SheetDescription className="sr-only">
                                查看
                                {getTabTitle(mobileTabSheetContent)}
                                详细信息
                            </SheetDescription> */}
                        </SheetHeader>
                        <div className="overflow-y-auto">
                            {renderMobileTabContent()}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <SwapDialog
                open={isSwapDialogOpen}
                onOpenChange={setIsSwapDialogOpen}
                defaultTab={swapDialogTab}
                tokenId={selectedToken?.id}
            />

            <CreateTokenDialog
                open={isCreateTokenDialogOpen}
                onOpenChange={setIsCreateTokenDialogOpen}
            />


            <WithdrawDialog
                open={isWithdrawDialogOpen}
                onOpenChange={setIsWithdrawDialogOpen}
                investmentId={selectedInvestmentGroup}
                walletAddress={address}
            />

            <UpdateTokenDialog
                open={isUpdateTokenDialogOpen}
                onOpenChange={setIsUpdateTokenDialogOpen}
                token={selectedUpdateToken}
                // setSpinning={setSpinning}
                walletAddress={address}
            />

            {/* <Freeze
                open={freezeDialogOpen}
                onOpenChange={setFreezeDialogOpen}
                token={selectedToken}
                walletAddress={address}
            /> */}
            {/* <Spin
                spinning={spinning} fullscreen
                indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
                size="large"
                className="z-index" /> */}
        </div>
    );
}
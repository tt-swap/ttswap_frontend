import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from "react";
import { TokenIcon } from "../common/TokenIcon";
import { upToken } from '@/services/graphql/account';
import { useLocalStorage } from "@/utils/LocalStorageManager";
import { GRK_SIZES } from "@/types/common";
import { Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import CreatModal from "./creatModal";
import { Switch } from "@/components/ui/switch";

interface FreezeProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    token: any | null;
    walletAddress: string | null;
}

interface TokenConfig {
    investFee: number;
    divestFee: number;
    buyFee: number;
    sellFee: number;
    investM: number;
    divestChips: number;
    maxInvestM: number;
}

export function Freeze({
    open,
    onOpenChange,
    token,
    walletAddress
}: FreezeProps) {
    const { t } = useTranslation();
    const { ssionChian } = useLocalStorage();

    const [spinning, setSpinning] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [isFrozen, setIsFrozen] = useState(false); // 是否冻结


    useEffect(() => {
        setIsFrozen(false);
        if (!open) return;
        (async () => {
            if (ssionChian && token) {
                const result: TokenConfig = await upToken(token.id, ssionChian) as TokenConfig;
                console.log("---===", result);
            }
        })();
    }, [ssionChian, token, open]);

    // 更新市场配置
    const handleUpdateMarket = async () => {
        if (!token) return;

        setSpinning(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            onOpenChange(false);
        } catch (error) {
            // toast.error("更新失败，请重试");
        } finally {
            setSpinning(false);
        }
    };

    // 如果没有选中代币，不渲染对话框
    if (!token) return null;

    return (
        <>
            {contextHolder}
            <CreatModal open={open} setOpen={onOpenChange} title="冻结代币">
                <Spin spinning={spinning} fullscreen indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} size="large" />

                <div className="flex flex-col h-full">
                    <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 flex-shrink-0 animate-slide-in-up">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                                style={{ backgroundColor: token.color ? token.color : "" }}
                            >
                                <TokenIcon
                                    isValueToken={token.isvaluegood}
                                    icon={token.logo_url}
                                    color=""
                                    size={GRK_SIZES.SMALL}
                                    showPulse={token.isvaluegood}
                                />
                            </div>
                            <div className="min-w-0">
                                <h2 className="font-medium truncate">{token.symbol}</h2>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">{token.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 h-0">
                        <div className="px-4 sm:px-6">
                            {/* 市场配置标签页 */}
                            <div className="pb-4 sm:pb-6 pt-0 space-y-3 sm:space-y-4">
                                {/* 说明 */}

                                {/* 是否冻结 */}
                                <div className="flex items-center justify-between py-2">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="isFrozen" className="cursor-pointer">
                                            是否冻结
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                            冻结后将暂停所有交易操作
                                        </p>
                                    </div>
                                    <Switch
                                        id="isFrozen"
                                        checked={isFrozen}
                                        onCheckedChange={setIsFrozen}
                                    />
                                </div>

                                {/* 更新按钮 */}
                                <div className="pt-3 sm:pt-4">
                                    <Button
                                        className="w-full h-10 sm:h-12 bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm transition-all duration-200 text-sm sm:text-base"
                                        onClick={handleUpdateMarket}
                                        disabled={!isFrozen}
                                    >
                                     冻结
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CreatModal>
        </>
    );
}
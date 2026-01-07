import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from 'react-i18next';
import CreatModal from "./creatModal";
import { useMaxApprove } from '@/hooks/useMaxApprove';
import {
    HelpCircle,
    Shield,
    Zap,
} from "lucide-react";
import { useState, useEffect } from "react";

interface SwapSetingProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onChange: (val: string, val1: boolean, val2: boolean) => void;
}

export function SwapSeting({
    open,
    onOpenChange,
    onChange
}: SwapSetingProps) {
    const { t } = useTranslation();
    const [slippage, setSlippage] = useState("0.5");
    const [antiMEV, setAntiMEV] = useState(true);
    const { maxApprove, setMaxApprove } = useMaxApprove();

    useEffect(() => {
        onChange(slippage, antiMEV, maxApprove);
    }, [slippage, antiMEV, maxApprove]);

    return (
        <>
            {/* 高级设置对话框 */}
            <CreatModal open={open} setOpen={onOpenChange} title={t("trade.swap.seting.title")}>
                <div className="pb-2"> {t("trade.swap.seting.title.desc")}</div>
                <div className="space-y-6 py-4">
                    {/* 滑点设置 */}
                    <div className="space-y-3">
                        <Label>{t("trade.swap.tolerance")}</Label>
                        <div className="grid grid-cols-4 gap-2">
                            {["0.1", "0.5", "1.0", "3.0"].map((value) => (
                                <Button
                                    key={value}
                                    variant={
                                        slippage === value ? "default" : "outline"
                                    }
                                    size="sm"
                                    className={
                                        slippage === value
                                            ? "bg-[#0fb981] hover:bg-[#22c55e] text-white border-0"
                                            : "hover:border-[#0fb981] hover:text-[#0fb981]"
                                    }
                                    onClick={() => setSlippage(value)}
                                >
                                    {value}%
                                </Button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <Input
                                value={slippage}
                                onChange={(e) => setSlippage(e.target.value)}
                                placeholder={t("trade.swap.seting.tolerance.customize")}
                                className="flex-1"
                            />
                            <span className="text-sm text-muted-foreground">
                                %
                            </span>
                        </div>
                    </div>

                    <Separator />

                    {/* MEV 保护设置 */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-blue-600" />
                                <Label>{t("trade.swap.seting.mev")}</Label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {t("trade.swap.seting.mev.desc")}
                            </p>
                        </div>
                        <Switch
                            className="data-[state=checked]:bg-[#0fb981]"
                            checked={antiMEV}
                            onCheckedChange={setAntiMEV}
                        />
                    </div>

                    <Separator />

                    {/* 最大授权设置 */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-yellow-600" />
                                <Label>{t("trade.swap.seting.maxApprove")}</Label>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {t("trade.swap.seting.maxApprove.desc")}
                            </p>
                        </div>
                        <Switch
                            className="data-[state=checked]:bg-[#0fb981]"
                            checked={maxApprove}
                            onCheckedChange={setMaxApprove}
                        />
                    </div>

                    <Separator />

                    {/* 帮助信息 */}
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-start gap-2">
                            <HelpCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-blue-900">
                                    {t("trade.swap.seting.tips.title")}
                                </p>
                                <p className="text-xs text-blue-700">
                                    •  {t("trade.swap.seting.tips.tip1")}
                                    <br />
                                    •  {t("trade.swap.seting.tips.tip2")}
                                    <br />•  {t("trade.swap.seting.tips.tip3")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CreatModal>
        </>
    );
}

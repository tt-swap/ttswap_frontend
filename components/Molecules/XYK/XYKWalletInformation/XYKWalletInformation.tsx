import React, { useEffect } from "react";
import { type Option, Some, None } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { copyToClipboard } from "@/utils/functions";
import { useState } from "react";
import { useToast } from "../../../../utils/hooks";
import { IconWrapper } from "@/components/Shared";
import { type XYKWalletInformationProps } from "@/utils/types/molecules.types";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { useValueGood } from "@/stores/valueGood";

import { myIndexes } from '@/graphql/account';
import { prettifyCurrencys } from '@/graphql/util';

export const XYKWalletInformation: React.FC<XYKWalletInformationProps> = ({
    wallet_address,
    chain_name,
    dex_name,
    wallet_data, value_good_id,chain_id
}) => {
    const [maybeResult, setResult] = useState(None);
    const { toast } = useToast();
    const { info } = useValueGood();
    const { covalentClient } = useGoldRush();

    const handlePoolInformation = async () => {
        setResult(None);
        let response;
        try {
            response =
                await myIndexes(
                    value_good_id,
                    wallet_address,chain_id
                );
            // @ts-ignore
            setResult(response);
        } catch (error) {
            console.error(`Error fetching token for ${chain_name}:`, error);
        }
    };

    const InformationContainer: React.FC<{
        label: string;
        text: string;
        copy?: boolean;
    }> = ({ label, text, copy = false }) => {
        const [showCopy, setShowCopy] = useState(false);

        const handleCopyClick = () => {
            toast({
                description: "Address copied!",
            });
            copyToClipboard(text);
            setShowCopy(true);
            setTimeout(() => {
                setShowCopy(false);
            }, 3000);
        };

        return (
            <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                    <h2 className="text-xl">{text}</h2>
                    {showCopy ? (
                        <IconWrapper
                            icon_class_name="done"
                            icon_size="text-sm"
                            class_name="text-secondary-light dark:text-secondary-dark"
                        />
                    ) : (
                        copy && (
                            <IconWrapper
                                icon_class_name="content_copy"
                                icon_size="text-sm"
                                class_name="text-secondary-light dark:text-secondary-light cursor-pointer"
                                on_click={() => handleCopyClick()}
                            />
                        )
                    )}
                </div>
                <div className="text-md text-secondary-light">{label}</div>
            </div>
        );
    };

    useEffect(() => {
        handlePoolInformation();
    }, [dex_name, wallet_address, chain_name, value_good_id]);

    // console.log(7777, maybeResult);
    return (
        <>
            <div className="flex items-center rounded border p-4">
                {!maybeResult.isEmpty ? (
                    <div className="flex flex-grow flex-wrap items-center gap-8">
                        <div className="flex flex-grow flex-wrap items-center gap-8">
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-2">
                                    <h2 className="text-xl">{
                                        // @ts-ignore
                                        prettifyCurrencys(maybeResult.tradeValue)}{" "}{info.symbol}</h2>
                                </div>
                                <div className="text-md text-secondary-light">Total Trade Amount</div>
                            </div>
                        </div>
                        {/* <div className="flex flex-grow flex-wrap items-center gap-8">
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-2">
                                    <h2 className="text-xl">{
                                        // @ts-ignore
                                        maybeResult.tradeCount}</h2>
                                </div>
                                <div className="text-md text-secondary-light">Total Trade Count</div>
                            </div>
                        </div> */}
                        <div className="flex flex-grow flex-wrap items-center gap-8">
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-2">
                                    <h2 className="text-xl">{
                                        // @ts-ignore
                                        prettifyCurrencys(maybeResult.investValue)}{" "}{info.symbol}</h2>
                                </div>
                                <div className="text-md text-secondary-light">Total Invest Amount</div>
                            </div>
                        </div>
                        <div className="flex flex-grow flex-wrap items-center gap-8">
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-2">
                                    <h2 className="text-xl">{
                                        // @ts-ignore
                                        prettifyCurrencys(maybeResult.disinvestValue)}{" "}{info.symbol}</h2>
                                </div>
                                <div className="text-md text-secondary-light">Total Divest Amount</div>
                            </div>
                        </div>
                        <div className="flex flex-grow flex-wrap items-center gap-8">
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-2">
                                    <h2 className="text-xl">{
                                        // @ts-ignore
                                        prettifyCurrencys(maybeResult.totalprofitvalue)}{" "}{info.symbol}</h2>
                                </div>
                                <div className="text-md text-secondary-light">Total Profit Amount</div>
                            </div>
                        </div>
                        <div className="flex flex-grow flex-wrap items-center gap-8">
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-2">
                                    <h2 className="text-xl">{
                                        // @ts-ignore
                                        prettifyCurrencys(maybeResult.totalcommissionvalue)}{" "}{info.symbol}</h2>
                                </div>
                                <div className="text-md text-secondary-light">Total Commission Amount</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-grow items-center gap-x-8">
                        {[1, 2].map((i) => {
                            return (
                                <Skeleton
                                    key={i}
                                    size={GRK_SIZES.LARGE}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

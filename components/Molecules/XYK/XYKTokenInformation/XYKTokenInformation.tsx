import React, { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { type Option, Some, None } from "@/utils/option";
// import { useGoldRush } from "@/utils/store";
import { copyToClipboard, truncate } from "@/utils/functions";
// @ts-ignore
import { type TokenV2VolumeWithChartData } from "@/utils/types/XykServiceTypes";
import { useState } from "react";
import { useToast } from "../../../../utils/hooks";
import { IconWrapper } from "@/components/Shared";
import { type XYKTokenInformationProps } from "@/utils/types/molecules.types";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { Button, message } from 'antd';

export const XYKTokenInformation: React.FC<XYKTokenInformationProps> = ({
    token_address,
    chain_name,
    dex_name,
    token_data,
}) => {
    const [maybeResult, setResult] =
        useState<Option<TokenV2VolumeWithChartData>>(None);
    const { toast } = useToast();
    const [messageApi, contextHolder] = message.useMessage();
    const { t } = useTranslation();

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
            messageApi.open({
                type: 'success',
                content: t('common.mess.copy'),
              });
        };

        return (
            <div className="flex flex-col gap-1">
                <h2 className="text-md font-color-1">{label}</h2>
                <div className="flex font-s-8 gap-2">
                    {truncate(text)}
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
            </div>
        );
    };

    useEffect(() => {
        if (token_data) {
            // @ts-ignore
            setResult(new Some(token_data));
            return;
        }
        // handlePoolInformation();
    }, [dex_name, token_address, chain_name]);

    return (
        <>
            {contextHolder}
            <div className="flex items-center rounded border p-4">
                {maybeResult.match({
                    None: () => {
                        return (
                            <div className="flex flex-grow items-center gap-x-8">
                                {[1, 2, 3, 4].map((o, i) => {
                                    return (
                                        <Skeleton
                                            key={i}
                                            size={GRK_SIZES.LARGE}
                                        />
                                    );
                                })}
                            </div>
                        );
                    },
                    Some: (result) => {
                        return (
                            <div className="flex flex-grow flex-wrap items-center gap-8">
                                <InformationContainer
                                    label={t("body.goods.info.symbol")}
                                    text={`${result.symbol}`}
                                />
                                <InformationContainer
                                    label={t("body.goods.info.name")}
                                    text={`${result.name}`}
                                    copy
                                />
                                <InformationContainer
                                    label={t("body.goods.info.address")}
                                    text={`${result.address}`}
                                    copy
                                />
                                <InformationContainer
                                    label={t("body.goods.info.goodsid")}
                                    text={token_address}
                                    copy
                                />
                            </div>
                        );
                    },
                })}

                {maybeResult.match({
                    None: () => <Skeleton size={GRK_SIZES.LARGE} />,
                    Some: (result) => (
                        <a target="_blank" href={result.exp_url}>
                            <Button
                                // shape="round"
                                size="large"
                                type="primary">{t("body.goods.info.bnt")}</Button>
                        </a>
                    ),
                })}
            </div>
        </>
    );
};

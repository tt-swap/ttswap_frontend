import React, { useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { type Option, Some, None } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { copyToClipboard } from "@/utils/functions";
import { useState } from "react";
import { Col, Row } from 'antd';
import { useToast } from "@/utils/hooks";
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
    wallet_data, value_good_id, chain_id
}) => {
    const [maybeResult, setResult] = useState(None);
    const { toast } = useToast();
    const { info } = useValueGood();
    const { covalentClient } = useGoldRush();
    const { t } = useTranslation();

    const handlePoolInformation = async () => {
        setResult(None);
        let response;
        try {
            response =
                await myIndexes(
                    value_good_id,
                    wallet_address, chain_id
                );
            // @ts-ignore
            setResult(response);
            console.log("XYKWalletInformation",response)
        } catch (error) {
            console.error(`Error fetching token for ${chain_name}:`, error);
        }
    };

    useEffect(() => {
        handlePoolInformation();
    }, [dex_name, wallet_address, chain_name, value_good_id]);

    return (
        <>
            <div className="flex flex-grow flex-wrap items-center gap-8 rounded border p-4">
                {!maybeResult.isEmpty ? (
                    <>
                        <Row className="items-center w-full">
                            <Col className="flex flex-grow flex-wrap items-center gap-8"
                                xs={{ flex: '50%' }}
                                sm={{ flex: '50%' }}
                                lg={{ flex: '25%' }}>
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-2">
                                        <h2 className="text-xl">{
                                            // @ts-ignore
                                            prettifyCurrencys(maybeResult.tradeValue)}{" "}{info.symbol}</h2>
                                    </div>
                                    <div className="text-md text-[#7D7D7D]">{t('body.account.index.tradeamount')}</div>
                                </div>
                            </Col>
                            <Col className="flex flex-grow flex-wrap items-center gap-8"
                                xs={{ flex: '50%' }}
                                sm={{ flex: '50%' }}
                                lg={{ flex: '25%' }}>
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-2">
                                        <h2 className="text-xl">{
                                            // @ts-ignore
                                            prettifyCurrencys(maybeResult.investValue)}{" "}{info.symbol}</h2>
                                    </div>
                                    <div className="text-md text-[#7D7D7D]">{t('body.account.index.investamount')}</div>
                                </div>
                            </Col>
                            <Col className="flex flex-grow flex-wrap items-center gap-8"
                                xs={{ flex: '50%' }}
                                sm={{ flex: '50%' }}
                                lg={{ flex: '25%' }}>
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-2">
                                        <h2 className="text-xl">{
                                            // @ts-ignore
                                            prettifyCurrencys(maybeResult.disinvestValue)}{" "}{info.symbol}</h2>
                                    </div>
                                    <div className="text-md text-[#7D7D7D]">{t('body.account.index.divestamount')}</div>
                                </div>
                            </Col>
                            <Col className="flex flex-grow flex-wrap items-center gap-8"
                                xs={{ flex: '50%' }}
                                sm={{ flex: '50%' }}
                                lg={{ flex: '25%' }}>
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-2">
                                        <h2 className="text-xl">{
                                            // @ts-ignore
                                            prettifyCurrencys(maybeResult.stakettsvalue)}{" "}{info.symbol}</h2>
                                    </div>
                                    <div className="text-md text-[#7D7D7D]">{t('body.account.index.miningvalue')}</div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="items-center w-full">
                            <Col className="flex flex-grow flex-wrap items-center gap-8"
                                xs={{ flex: '50%' }}
                                sm={{ flex: '50%' }}
                                lg={{ flex: '25%' }}>
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-2">
                                        <h2 className="text-xl">{
                                            // @ts-ignore
                                            prettifyCurrencys(maybeResult.totalprofitvalue)}{" "}{info.symbol}</h2>
                                    </div>
                                    <div className="text-md text-[#7D7D7D]">{t('body.account.index.profitamount')}</div>
                                </div>
                            </Col>
                            <Col className="flex flex-grow flex-wrap items-center gap-8"
                                xs={{ flex: '50%' }}
                                sm={{ flex: '50%' }}
                                lg={{ flex: '25%' }}>
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-2">
                                        <h2 className="text-xl">{
                                            // @ts-ignore
                                            prettifyCurrencys(maybeResult.totalcommissionvalue)}{" "}{info.symbol}</h2>
                                    </div>
                                    <div className="text-md text-[#7D7D7D]">{t('body.account.index.commissionamount')}</div>
                                </div>
                            </Col>
                            <Col className="flex flex-grow flex-wrap items-center gap-8"
                                xs={{ flex: '50%' }}
                                sm={{ flex: '50%' }}
                                lg={{ flex: '25%' }}>
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-2">
                                        <h2 className="text-xl">{
                                            // @ts-ignore
                                            prettifyCurrencys(maybeResult.getfromstake)}</h2>
                                    </div>
                                    <div className="text-md text-[#7D7D7D]">{t('body.account.index.mintedtts')}</div>
                                </div>
                            </Col>
                            <Col className="flex flex-grow flex-wrap items-center gap-8"
                                xs={{ flex: '50%' }}
                                sm={{ flex: '50%' }}
                                lg={{ flex: '25%' }}>
                                <div className="flex flex-col gap-1">
                                    <div className="flex gap-2">
                                        <h2 className="text-xl">{
                                            // @ts-ignore
                                            prettifyCurrencys(maybeResult.mining)}</h2>
                                    </div>
                                    <div className="text-md text-[#7D7D7D]">{t('body.account.index.mining')}</div>
                                </div>
                            </Col>
                        </Row>
                    </>
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

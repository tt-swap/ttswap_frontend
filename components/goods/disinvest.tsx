import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Form,
    Input,
    Button, Spin, message,
    Space, Avatar
} from 'antd';
// import { Button } from "@/components/ui/button";
import CreatModal from "./creatModal";
import "./index.css"
import useWallet from "@/hooks/useWallet";
import { LoadingOutlined } from '@ant-design/icons';
import { useWeb3React } from "@web3-react/core";
// import { useSwitchChain } from "hooks";
import { useErrorMess } from '@/hooks/useErrorMess';
import { useLocalStorage } from "@/utils/LocalStorageManager";

import { myDisInvestProofGood } from '@/graphql/account';
import { prettifyCurrencys, powerIterative, prettifyCurrencysFee, getDecimalPlaces, withoutRounding } from '@/graphql/util';

interface Props {
    open_zt: boolean;
    dis_id: number;
    setOpen: (value: boolean) => void;
    setDataNum: (value: number) => void;
}
export const Disinvest = ({ open_zt, dis_id, setOpen, setDataNum }: Props) => {

    const [spinning, setSpinning] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    // const switchChain = useSwitchChain();
    const { chainId } = useWeb3React();
    // @ts-ignore
    const { ssionChian } = useLocalStorage();

    const [goodQ, setGoodQ] = useState("");
    const [goodVQ, setGoodVQ] = useState("");
    const [disgood, setDisgood] = useState({ id: 0 });
    const [disgoodCot, setDisgoodCot] = useState({});
    const { t } = useTranslation();

    // const [goodVAddr, setGoodVAddr] = useState("");
    // const [goodDec, setGoodDec] = useState(0);

    const { disinvest } = useWallet();

    let count = { good1: { quantity: 0, profit: 0, disfee: 0, count: 0 }, good2: { quantity: 0, profit: 0, disfee: 0, count: 0 } };


    useMemo(() => {
        setGoodVQ("");
        setGoodQ("");
        console.log(dis_id, 1001, goodQ, goodVQ);
        // setOpen(open_zt);
        (async () => {
            if (dis_id > 0 && open_zt) {
                setSpinning(true);
                let tokens: any = await myDisInvestProofGood(dis_id, ssionChian);
                console.log(tokens, 99)
                setDisgood(tokens);
                // count.good1.quantity = tokens.good1.investActualQuantity;
                // count.good1.profit = tokens.good1.profit;
                // count.good1.disfee = tokens.good1.disfee;
                // count.good1.count = tokens.good1.quantity + tokens.good1.profit - tokens.good1.disfee;
                // count.good2.quantity = tokens.good2.quantity;
                // count.good2.profit = tokens.good2.profit;
                // count.good2.disfee = tokens.good2.disfee;
                // count.good2.count = tokens.good2.quantity + tokens.good2.profit - tokens.good2.disfee;
                // setDisgoodCot(count);
                disAmount(tokens, 0, 0, 0);
                setSpinning(false);
                // setPercent(0);
            }
        })();
    }, [dis_id, open_zt, ssionChian]);

    const isDisabled = useMemo(() => {
        // console.log(buyF, sellF, inF, disinF, swapS, disinS, goodQ, goodVQ, goodC, goodV)
        // @ts-ignore
        if (goodQ === "" || goodQ === "0" || goodQ <= 0)
            return true;
        return false;
    }, [goodQ, goodVQ])

    function disAmount(e: any, zt: number, amount: number, amount2: number) {
        // console.log("99999999", e, zt, amount)
        if (zt == 0) {
            count.good1.quantity = e.good1.investActualQuantity;
            count.good1.profit = e.good1.profit;
            count.good1.disfee = e.good1.disfee;
            count.good1.count = e.good1.quantity + e.good1.profit - e.good1.disfee;
            count.good2.quantity = e.good2.quantity;
            count.good2.profit = e.good2.profit;
            count.good2.disfee = e.good2.disfee;
            count.good2.count = e.good2.quantity + e.good2.profit - e.good2.disfee;
        } else if (zt == 1) {
            let g1da = e.good1.quantity / e.good1.investShares * amount;
            let g1ada = e.good1.investActualQuantity / e.good1.investShares * amount;
            let sy = e.good1.investQuantity / e.good1.allInvestShares * amount - g1da;
            let sxf = g1da * e.good1.rate;
            count.good1.quantity = g1ada;
            count.good1.profit = sy;
            count.good1.disfee = sxf;
            count.good1.count = sy + g1ada - sxf;
        } else {
            let g1da = e.good1.quantity / e.good1.investShares * amount;
            let g1ada = e.good1.investActualQuantity / e.good1.investShares * amount;
            let sy = e.good1.investQuantity / e.good1.allInvestShares * amount - g1da;
            let sxf = g1da * e.good1.rate;
            count.good1.quantity = g1ada;
            count.good1.profit = sy;
            count.good1.disfee = sxf;
            count.good1.count = sy + g1ada - sxf;

            let g2da = e.good2.quantity / e.good1.investShares * amount;
            let g2ada = e.good2.investActualQuantity / e.good1.investShares * amount;
            let sy2 = e.good2.investQuantity / e.good2.allInvestShares * amount2 - g2da;
            let sxf2 = g2da * e.good2.rate;
            count.good2.quantity = g2ada;
            count.good2.profit = sy2;
            count.good2.disfee = sxf2;
            count.good2.count = sy2 + g2ada - sxf2;
        }
        setDisgoodCot(count);
    }
    const disinvestgood = async () => {
        setSpinning(true);
        // await switchChain(Number(ssionChian)).then(async () => {
        // @ts-ignore
        const qunt = Number(goodQ * powerIterative(10, disgood.good1.decimals)).toFixed(0);
        console.log("dis---", qunt, goodQ)
        const isSuccess = await disinvest(disgood.id, BigInt(qunt));
        if (isSuccess === true) {
            messageApi.open({
                type: 'success',
                content: t('common.divest') + t('common.mess.success'),
            });
            setDataNum(1);
            setOpen(false);
        } else if (isSuccess === false) {
            messageApi.open({
                type: 'error',
                content: t('common.divest') + t('common.mess.error'),
            });
        } else {
            messageApi.open({
                type: 'error',
                content: useErrorMess(isSuccess, t),
            });
        }
        // }).catch((error) => {
        //     console.error(`"Failed to switch chains: " ${error}`);
        // });
        setSpinning(false);
        document.body.style.overflow = "";
    };

    const goodQOn = (e: any) => {
        // @ts-ignore
        const g1: number = disgood.good1.decimals;
        let numg1 = e.target.value;
        const pd = parseFloat(e.target.value);
        if (Number(numg1) < 0 || isNaN(pd)) {
            numg1 = 0;
            setGoodQ("");
            console.log("----00000", goodQ, e.target.value)
        }
        // else {
        const ws = getDecimalPlaces(numg1);
        if (ws > g1) {
            numg1 = withoutRounding(numg1, 6);//Number(numg1).toFixed(g1);
        }
        // console.log("------00--",withoutRounding(2.111111111111111, g1));
        // @ts-ignore
        if (disgood.isvaluegood) {
            // let num = 0;
            // @ts-ignore
            if (numg1 < disgood.good1.quantity && numg1 < disgood.good1.maxNum || numg1 == disgood.good1.maxNum) {
                if (e.target.value == "" && numg1 == 0) {
                } else {
                    setGoodQ(numg1);
                }
                numg1 = Number(numg1);
            } else {
                setGoodQ(goodQ);
                numg1 = Number(goodQ);
            }
            // @ts-ignore
            // let g1dn = disgood.good1.quantity / disgood.good1.investShares * numg1;
            // count.good1.quantity = g1dn;
            // // @ts-ignore
            // count.good1.profit = disgood.good1.nowNAVPS * num - num / disgood.good1.quantity * disgood.good1.contructFee;
            // // @ts-ignore
            // count.good1.disfee = num * disgood.good1.rate;
            // count.good1.count = count.good1.quantity + count.good1.profit - count.good1.disfee;
            // setDisgoodCot(count);
            disAmount(disgood, 1, numg1);
            console.log("00000", disgoodCot, 999)
        } else {
            // @ts-ignore
            const g2 = disgood.good2.decimals;
            let num = Number(numg1);
            // @ts-ignore
            let num1: any = disgood.good2.investShares / disgood.good1.investShares * num;
            const ws = getDecimalPlaces(num1);
            if (ws > g2) {
                num1 = withoutRounding(Number(num1), g2);//num1.toFixed(g2);
            }
            // @ts-ignore
            if (num < disgood.good1.quantity && num < disgood.good1.maxNum || num == disgood.good1.maxNum && num1 < disgood.good2.quantity && num1 < disgood.good2.maxNum || num1 == disgood.good2.maxNum) {
                if (e.target.value == "" && numg1 == 0) {
                } else {
                    setGoodQ(numg1);
                }
                // @ts-ignore
                setGoodVQ(num1);
                num1 = Number(num1);
            } else {
                setGoodQ(goodQ);
                setGoodVQ(goodVQ);
                numg1 = Number(goodQ);
                num1 = Number(goodVQ);
            }
            // count.good1.quantity = num;
            // // @ts-ignore
            // count.good1.profit = disgood.good1.nowNAVPS * num - num / disgood.good1.quantity * disgood.good1.contructFee;
            // // @ts-ignore
            // count.good1.disfee = num * disgood.good1.rate;
            // count.good1.count = count.good1.quantity + count.good1.profit - count.good1.disfee;
            // count.good2.quantity = num1;
            // // @ts-ignore
            // count.good2.profit = disgood.good2.nowNAVPS * num1 - num1 / disgood.good2.quantity * disgood.good2.contructFee;
            // // @ts-ignore
            // count.good2.disfee = num1 * disgood.good2.rate;
            // count.good2.count = count.good2.quantity + count.good2.profit - count.good2.disfee;
            // setDisgoodCot(count);
            disAmount(disgood, 2, numg1, num1);
            console.log("------", numg1, num1, count)

        }
        // }

    };
    // @ts-ignore
    const goodVQOn = (e: any) => {
        // @ts-ignore
        const g1: number = disgood.good1.decimals; const g2: number = disgood.good2.decimals;

        // let num1 = Number(e.target.value);
        // let num1 = e.target.value;
        // if ((num1.toString().length - 2) > g2) {
        //     num1 = num1.toFixed(g2);
        // }
        let num1 = e.target.value;
        const pd = parseFloat(e.target.value);
        if (Number(num1) < 0 || isNaN(pd)) {
            num1 = 0;
            setGoodVQ("");
        }
        // else {
        const ws = getDecimalPlaces(num1);
        if (ws > g2) {
            num1 = withoutRounding(Number(num1), g2);//Number(num1).toFixed(g2);
        }
        // @ts-ignore
        let num: any = num1 / (disgood.good2.investShares / disgood.good1.investShares);
        console.log("++++++", num)
        // if ((num.toString().length - 2) > g1) {
        //     num = num.toFixed(g1);
        // }
        const ws1 = getDecimalPlaces(num);
        if (ws1 > g1) {
            num = withoutRounding(Number(num), g1);//Number(num).toFixed(g1);
        }
        // @ts-ignore
        if (num < disgood.good1.quantity && num < disgood.good1.maxNum || num == disgood.good1.maxNum && num1 < disgood.good2.quantity && num1 < disgood.good2.maxNum || num1 == disgood.good2.maxNum) {

            if (e.target.value == "" && num1 == 0) {
            } else {
                setGoodVQ(num1);
            }
            setGoodQ(num);
            // setGoodVQ(num1);
            num = Number(num);
            num1 = Number(num1);
        } else {
            setGoodQ(goodQ);
            setGoodVQ(goodVQ);
            num = Number(goodQ);
            num1 = Number(goodVQ);
        }
        console.log("++++++", num, num1)
        // count.good1.quantity = num;
        // // @ts-ignore
        // count.good1.profit = disgood.good1.nowNAVPS * num - num / disgood.good1.quantity * disgood.good1.contructFee;
        // // @ts-ignore
        // count.good1.disfee = num * disgood.good1.rate;
        // count.good1.count = count.good1.quantity + count.good1.profit - count.good1.disfee;
        // count.good2.quantity = num1;
        // // @ts-ignore
        // count.good2.profit = disgood.good2.nowNAVPS * num1 - num1 / disgood.good2.quantity * disgood.good2.contructFee;
        // // @ts-ignore
        // count.good2.disfee = num1 * disgood.good2.rate;
        // count.good2.count = count.good2.quantity + count.good2.profit - count.good2.disfee;
        // setDisgoodCot(count);
        disAmount(disgood, 2, num, num1);
        // }
    };

    return (
        <>
            {contextHolder}
            <CreatModal open={open_zt} setOpen={setOpen} title={t('common.divest')}>
                <Spin spinning={spinning} fullscreen indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} size="large" />
                {disgood.id !== 0 && (
                    <div className='newgood'>
                        <div>
                            {/* {disgood} */}
                            <div className='pt-2 pb-2'>
                                <div className='flex justify-between items-center'>
                                    <div><Space><Avatar src={
                                        // @ts-ignore
                                        <img src={disgood.good1.logo_url} alt="avatar" onError={(e) => {
                                            e.currentTarget.src =
                                                "/token.svg";
                                        }} />} /><span>{
                                            // @ts-ignore
                                            disgood.good1.symbol}</span></Space></div>
                                    <div><Space><span>{t('body.account.divest.NAVPS')}:</span><span>{
                                        // @ts-ignore
                                        prettifyCurrencysFee(disgood.good1.nowNAVPS)}</span></Space></div>
                                </div>
                                <div className='pt-2 pb-2'>
                                    <div><Space><span>{t('body.account.divest.investShares')}:</span><span>{
                                        // @ts-ignore
                                        prettifyCurrencys(disgood.good1.investShares)}</span></Space></div>
                                    <div><Space><span>{t('body.account.divest.investquantity')}:</span><span>{
                                        // @ts-ignore
                                        prettifyCurrencys(disgood.good1.quantity)}</span></Space></div>
                                    <div><Space><span>{t('body.account.divest.investActualQuantity')}:</span><span>{
                                        // @ts-ignore
                                        prettifyCurrencys(disgood.good1.investActualQuantity)}</span></Space></div>
                                    <div><Space><span>{t('body.account.divest.investNAVPS')}:</span><span>{
                                        // @ts-ignore
                                        prettifyCurrencysFee(disgood.good1.NAVPS)}</span></Space></div>
                                    <div><Space><span>{t('body.account.divest.estprofit')}:</span><span>{
                                        // @ts-ignore
                                        prettifyCurrencysFee(disgood.good1.profit)}</span></Space></div>
                                    <div><Space><span>{t('body.account.divest.earningrate')}:</span><span>{
                                        // @ts-ignore
                                        prettifyCurrencys(disgood.good1.earningRate * 100)}%</span></Space></div>
                                </div>
                            </div>
                            {
                                // @ts-ignore
                                !disgood.isvaluegood && (

                                    <div className='pt-2 pb-2'>
                                        <div className='flex justify-between items-center'>
                                            <div><Space><Avatar src={<img src={
                                                // @ts-ignore
                                                disgood.good2.logo_url} alt="avatar" onError={(e) => {
                                                    e.currentTarget.src =
                                                        "/token.svg";
                                                }} />} /><span>{
                                                    // @ts-ignore
                                                    disgood.good2.symbol}</span></Space></div>
                                            <div><Space><span>{t('body.account.divest.NAVPS')}:</span><span>{
                                                // @ts-ignore
                                                prettifyCurrencysFee(disgood.good2.nowNAVPS)}</span></Space></div>
                                        </div>
                                        <div className='pt-2 pb-2'>
                                            <div><Space><span>{t('body.account.divest.investShares')}:</span><span>{
                                                // @ts-ignore
                                                prettifyCurrencys(disgood.good2.investShares)}</span></Space></div>
                                            <div><Space><span>{t('body.account.divest.investquantity')}:</span><span>{
                                                // @ts-ignore
                                                prettifyCurrencys(disgood.good2.quantity)}</span></Space></div>
                                            <div><Space><span>{t('body.account.divest.investActualQuantity')}:</span><span>{
                                                // @ts-ignore
                                                prettifyCurrencys(disgood.good2.investActualQuantity)}</span></Space></div>
                                            <div><Space><span>{t('body.account.divest.investNAVPS')}:</span><span>{
                                                // @ts-ignore
                                                prettifyCurrencysFee(disgood.good2.NAVPS)}</span></Space></div>
                                            <div><Space><span>{t('body.account.divest.estprofit')}:</span><span>{
                                                // @ts-ignore
                                                prettifyCurrencysFee(disgood.good2.profit)}</span></Space></div>
                                            <div><Space><span>{t('body.account.divest.earningrate')}:</span><span>{
                                                // @ts-ignore
                                                prettifyCurrencys(disgood.good2.earningRate * 100)}%</span></Space></div>
                                        </div>
                                    </div>
                                )}
                        </div>

                        <Form className='form-new' colon={false}>
                            <h2>{
                                // @ts-ignore
                                t('body.account.divest.divestShares')}{"(Max:"}{disgood.good1.maxNum}{")"}</h2>
                            <Form.Item>
                                <Input
                                    placeholder="0"
                                    type='number'
                                    onChange={goodQOn}
                                    min={0}
                                    // @ts-ignore

                                    max={disgood.good1.maxNum}
                                    value={goodQ}
                                    // @ts-ignore

                                    suffix={<Avatar src={<img src={disgood.good1.logo_url} alt="avatar" onError={(e) => {
                                        e.currentTarget.src =
                                            "/token.svg";
                                    }} />} />}
                                />
                                <div className='pt-2 pb-2'>
                                    <div className='flex justify-between'>
                                        <div><Space><span>{t('body.account.divest.volume')}:</span><span>{
                                            // @ts-ignore
                                            prettifyCurrencys(disgoodCot.good1.quantity)}</span></Space></div>
                                        <div><Space><span>{t('body.account.divest.profit')}:</span><span>{
                                            // @ts-ignore
                                            prettifyCurrencysFee(disgoodCot.good1.profit)}</span></Space></div>
                                    </div>
                                    <div className='text-end pt-2'><Space><span>{t('body.account.divest.fee')}:</span><span>{
                                        // @ts-ignore
                                        prettifyCurrencysFee(disgoodCot.good1.disfee)}</span></Space></div>
                                    <div className='text-end pt-2'><Space><span>{t('body.account.divest.total')}:</span><span>{
                                        // @ts-ignore
                                        prettifyCurrencys(disgoodCot.good1.count)}</span></Space></div>
                                </div>
                            </Form.Item>
                            {
                                // @ts-ignore
                                !disgood.isvaluegood && (
                                    <>
                                        <h2>{
                                            // @ts-ignore
                                            t('body.account.divest.divestShares')}{"(Max:"}{disgood.good2.maxNum}{")"}</h2>
                                        <Form.Item>
                                            <Input
                                                placeholder="0"
                                                type='number'
                                                min={0}
                                                max={
                                                    // @ts-ignore
                                                    disgood.good2.maxNum}
                                                onChange={goodVQOn}
                                                value={goodVQ}
                                                suffix={<Avatar src={<img src={
                                                    // @ts-ignore
                                                    disgood.good2.logo_url} alt="avatar" onError={(e) => {
                                                        e.currentTarget.src =
                                                            "/token.svg";
                                                    }} />} />}
                                            />
                                            <div className='pt-2 pb-2'>
                                                <div className='flex justify-between'>
                                                    <div><Space><span>{t('body.account.divest.volume')}:</span><span>{
                                                        // @ts-ignore
                                                        prettifyCurrencys(disgoodCot.good2.quantity)}</span></Space></div>
                                                    <div><Space><span>{t('body.account.divest.profit')}:</span><span>{
                                                        // @ts-ignore
                                                        prettifyCurrencysFee(disgoodCot.good2.profit)}</span></Space></div>
                                                </div>
                                                <div className='text-end pt-2'><Space><span>{t('body.account.divest.fee')}:</span><span>{
                                                    // @ts-ignore
                                                    prettifyCurrencysFee(disgoodCot.good2.disfee)}</span></Space></div>
                                                <div className='text-end pt-2'><Space><span>{t('body.account.divest.total')}:</span><span>{
                                                    // @ts-ignore
                                                    prettifyCurrencys(disgoodCot.good2.count)}</span></Space></div>
                                            </div>
                                        </Form.Item>
                                    </>
                                )}
                        </Form>
                        <Button
                            type="primary"
                            style={{ width: "100%" }}
                            disabled={isDisabled}
                            onClick={disinvestgood}
                        >{t('common.divest')}</Button>
                    </div>
                )}
            </CreatModal>
        </>
    );
};
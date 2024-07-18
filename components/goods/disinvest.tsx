import React, { useState, useMemo, useEffect } from 'react';
import {
    Form,
    Input,
    InputNumber, Spin, message,
    Space, Avatar
} from 'antd';
import { Button } from "@/components/ui/button";
import CreatModal from "./creatModal";
import "./index.css"
import useWallet from "@/hooks/useWallet";
import { LoadingOutlined } from '@ant-design/icons';

import { myDisInvestProofGood } from '@/graphql/account';
import { prettifyCurrencys, powerIterative } from '@/graphql/util';

interface Props {
    open_zt: boolean;
    dis_id: number;
    setOpen: (value: boolean) => void;
    setDataNum: (value: number) => void;
}
export const Disinvest = ({ open_zt, dis_id, setOpen, setDataNum }: Props) => {

    const [spinning, setSpinning] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [goodQ, setGoodQ] = useState("");
    const [goodVQ, setGoodVQ] = useState("");
    const [disgood, setDisgood] = useState({ id: 0 });
    const [disgoodCot, setDisgoodCot] = useState({});

    // const [goodVAddr, setGoodVAddr] = useState("");
    // const [goodDec, setGoodDec] = useState(0);

    const { disinvest } = useWallet();

    let count = { good1: { quantity: 0, profit: 0, disfee: 0, count: 0 }, good2: { quantity: 0, profit: 0, disfee: 0, count: 0 } };
    
    
    useMemo(() => {
        setGoodVQ("");
        setGoodQ("");
        console.log(dis_id, 1001,goodQ,goodVQ);
        // setOpen(open_zt);
        (async () => {
            if (dis_id > 0 && open_zt) {
                setSpinning(true);
                let tokens: any = await myDisInvestProofGood(dis_id);
                console.log(tokens, 99)
                setDisgood(tokens);
                count.good1.quantity = tokens.good1.quantity;
                count.good1.profit = tokens.good1.profit;
                count.good1.disfee = tokens.good1.disfee;
                count.good1.count = tokens.good1.quantity + tokens.good1.profit - tokens.good1.disfee;
                count.good2.quantity = tokens.good2.quantity;
                count.good2.profit = tokens.good2.profit;
                count.good2.disfee = tokens.good2.disfee;
                count.good2.count = tokens.good2.quantity + tokens.good2.profit - tokens.good2.disfee;
                setDisgoodCot(count);
                setSpinning(false);
                // setPercent(0);
            }
        })();
    }, [dis_id,open_zt]);

    const isDisabled = useMemo(() => {
        // console.log(buyF, sellF, inF, disinF, swapS, disinS, goodQ, goodVQ, goodC, goodV)
        // @ts-ignore
        if (goodQ === "" || goodQ === "0" || goodQ < 0)
            return true;
        return false;
    }, [goodQ, goodVQ])

    const disinvestgood = async () => {
        setSpinning(true);
        console.log(0)
        // @ts-ignore
        const qunt = Number(goodQ * powerIterative(10, disgood.good1.decimals));
        const isSuccess = await disinvest(disgood.id, BigInt(qunt));
        if (isSuccess) {
            messageApi.open({
                type: 'success',
                content: 'disinvest data sent sucess',
            });
            setDataNum(1);
            setOpen(false);
        } else {
            messageApi.open({
                type: 'error',
                content: 'disinvest data sent fail',
            });
        }
        setSpinning(false);
        document.body.style.overflow = "";
    };

    const goodQOn = (e: any) => {
        console.log(e.target,disgood)
        // @ts-ignore
        if (disgood.isvaluegood) {
            let num = 0;
            // @ts-ignore
            if (e.target.value < disgood.good1.quantity && e.target.value < disgood.good1.maxNum) {
                setGoodQ(e.target.value);
                num = Number(e.target.value);
            } else {
                setGoodQ(goodQ);
                num = Number(goodQ);
            }
            count.good1.quantity = num;
            // @ts-ignore
            count.good1.profit = disgood.good1.nowUnitFee * num - num / disgood.good1.quantity * disgood.good1.contructFee;
            // @ts-ignore
            count.good1.disfee = num * disgood.good1.rate;
            count.good1.count = count.good1.quantity + count.good1.profit - count.good1.disfee;
            setDisgoodCot(count);
            console.log(count, 999)
        } else {
            let num = Number(e.target.value);
            // @ts-ignore
            let num1 = disgood.good2.quantity * num / disgood.good1.quantity ;
            // @ts-ignore
            if (num < disgood.good1.quantity && num < disgood.good1.maxNum && num1 < disgood.good2.quantity && num1 < disgood.good2.maxNum) {
                setGoodQ(e.target.value);
                // @ts-ignore
                setGoodVQ(num1);
            } else {
                setGoodQ(goodQ);
                setGoodVQ(goodVQ);
                num = Number(goodQ);
                num1 = Number(goodVQ);
            }
            count.good1.quantity = num;
            // @ts-ignore
            count.good1.profit = disgood.good1.nowUnitFee * num - num / disgood.good1.quantity * disgood.good1.contructFee;
            // @ts-ignore
            count.good1.disfee = num * disgood.good1.rate;
            count.good1.count = count.good1.quantity + count.good1.profit - count.good1.disfee;
            count.good2.quantity = num1;
            // @ts-ignore
            count.good2.profit = disgood.good2.nowUnitFee * num1 - num1 / disgood.good2.quantity * disgood.good2.contructFee;
            // @ts-ignore
            count.good2.disfee = num1 * disgood.good2.rate;
            count.good2.count = count.good2.quantity + count.good2.profit - count.good2.disfee;
            setDisgoodCot(count);

        }

    };
    // @ts-ignore
    const goodVQOn = (e: any) => {

        let num1 = Number(e.target.value);
        // @ts-ignore
        let num = disgood.good1.quantity * num1 /disgood.good2.quantity;
        // @ts-ignore
        if (num < disgood.good1.quantity && num < disgood.good1.maxNum && num1 < disgood.good2.quantity && num1 < disgood.good2.maxNum) {

            // @ts-ignore
            setGoodQ(num); setGoodVQ(e.target.value);
        } else {
            setGoodQ(goodQ);
            setGoodVQ(goodVQ);
            num = Number(goodQ);
            num1 = Number(goodVQ);
        }
        count.good1.quantity = num;
        // @ts-ignore
        count.good1.profit = disgood.good1.nowUnitFee * num - num / disgood.good1.quantity * disgood.good1.contructFee;
        // @ts-ignore
        count.good1.disfee = num * disgood.good1.rate;
        count.good1.count = count.good1.quantity + count.good1.profit - count.good1.disfee;
        count.good2.quantity = num1;
        // @ts-ignore
        count.good2.profit = disgood.good2.nowUnitFee * num1 - num1 / disgood.good2.quantity * disgood.good2.contructFee;
        // @ts-ignore
        count.good2.disfee = num1 * disgood.good2.rate;
        count.good2.count = count.good2.quantity + count.good2.profit - count.good2.disfee;
        setDisgoodCot(count);

    };
    return (
        <>
            {contextHolder}
            <CreatModal open={open_zt} setOpen={setOpen} title={'Divest'}>
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
                                    <div><Space><span>Current Unit Fee:</span><span>{
                                        // @ts-ignore
                                        prettifyCurrencys(disgood.good1.nowUnitFee)}</span></Space></div>
                                </div>
                                <div className='pt-2 pb-2'>
                                    <div><Space><span>Invest quantity:</span><span>{
                                        // @ts-ignore
                                        prettifyCurrencys(disgood.good1.quantity)}</span></Space></div>
                                    <div><Space><span>Unit Fee at Invest:</span><span>{
                                        // @ts-ignore
                                        prettifyCurrencys(disgood.good1.unitFee)}</span></Space></div>
                                    <div><Space><span>Estimated Profit:</span><span>{
                                        // @ts-ignore
                                        prettifyCurrencys(disgood.good1.profit)}</span></Space></div>
                                    <div><Space><span>Earning Rate:</span><span>{
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
                                            <div><Space><span>Current Unit Fee:</span><span>{
                                                // @ts-ignore
                                                prettifyCurrencys(disgood.good2.nowUnitFee)}</span></Space></div>
                                        </div>
                                        <div className='pt-2 pb-2'>
                                            <div><Space><span>Invest quantity:</span><span>{
                                                // @ts-ignore
                                                prettifyCurrencys(disgood.good2.quantity)}</span></Space></div>
                                            <div><Space><span>Unit Fee at Invest:</span><span>{
                                                // @ts-ignore
                                                prettifyCurrencys(disgood.good2.unitFee)}</span></Space></div>
                                            <div><Space><span>Estimated Profit:</span><span>{
                                                // @ts-ignore
                                                prettifyCurrencys(disgood.good2.profit)}</span></Space></div>
                                            <div><Space><span>Earning Rate:</span><span>{
                                                // @ts-ignore
                                                prettifyCurrencys(disgood.good2.earningRate * 100)}%</span></Space></div>
                                        </div>
                                    </div>
                                )}
                        </div>

                        <Form className='form-new' colon={false}>

                            <h2>Disinvest Quantity</h2>
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
                                        <div><Space><span>Volume:</span><span>{
                                            // @ts-ignore
                                            prettifyCurrencys(disgoodCot.good1.quantity)}</span></Space></div>
                                        <div><Space><span>Profit:</span><span>{
                                            // @ts-ignore
                                            prettifyCurrencys(disgoodCot.good1.profit)}</span></Space></div>
                                    </div>
                                    <div className='text-end'><Space><span>Fee:</span><span>{
                                        // @ts-ignore
                                        prettifyCurrencys(disgoodCot.good1.disfee)}</span></Space></div>
                                    <div className='text-end'><Space><span>Total:</span><span>{
                                        // @ts-ignore
                                        prettifyCurrencys(disgoodCot.good1.count)}</span></Space></div>
                                </div>
                            </Form.Item>
                            {
                                // @ts-ignore
                                !disgood.isvaluegood && (
                                    <>
                                        <h2>Divest Value</h2>
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
                                                    <div><Space><span>Volume:</span><span>{
                                                        // @ts-ignore
                                                        prettifyCurrencys(disgoodCot.good2.quantity)}</span></Space></div>
                                                    <div><Space><span>Profit:</span><span>{
                                                        // @ts-ignore
                                                        prettifyCurrencys(disgoodCot.good2.profit)}</span></Space></div>
                                                </div>
                                                <div className='text-end'><Space><span>Fee:</span><span>{
                                                    // @ts-ignore
                                                    prettifyCurrencys(disgoodCot.good2.disfee)}</span></Space></div>
                                                <div className='text-end'><Space><span>Total:</span><span>{
                                                    // @ts-ignore
                                                    prettifyCurrencys(disgoodCot.good2.count)}</span></Space></div>
                                            </div>
                                        </Form.Item>
                                    </>
                                )}
                        </Form>
                        <Button
                            className='newButton'
                            style={{ width: "100%" }}
                            disabled={isDisabled}
                            onClick={disinvestgood}
                        >Divest</Button>
                    </div>
                )}
            </CreatModal>
        </>
    );
};
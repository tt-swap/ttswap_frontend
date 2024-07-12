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
export const Disinvest = ({ open_zt, dis_id, setOpen,setDataNum }: Props) => {

  const [spinning, setSpinning] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [goodQ, setGoodQ] = useState("");
  const [goodVQ, setGoodVQ] = useState("");
  const [disgood, setDisgood] = useState({ id: 0 });
  const [disgoodCot, setDisgoodCot] = useState({});

  const [goodVAddr, setGoodVAddr] = useState("");
  const [goodDec, setGoodDec] = useState(0);

  const { disinvest } = useWallet();

  let count = { good1: { quantity: 0, profit: 0, disfee: 0, count: 0 }, good2: { quantity: 0, profit: 0, disfee: 0, count: 0 } };
  useMemo(() => {
    console.log(dis_id, 1001);
    // setOpen(open_zt);
    (async () => {
      if (dis_id > 0) {
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
  }, [dis_id]);

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

  const goodQOn = (e) => {
    console.log(e.target)
    if (disgood.isvaluegood) {
      let num = 0;
      if (e.target.value < disgood.good1.quantity && e.target.value < disgood.good1.maxNum) {
        setGoodQ(e.target.value);
        num = Number(e.target.value);
      } else {
        setGoodQ(goodQ);
        num = Number(goodQ);
      }
      count.good1.quantity = num;
      count.good1.profit = disgood.good1.nowUnitFee * num - num / disgood.good1.quantity * disgood.good1.contructFee;
      count.good1.disfee = num * disgood.good1.rate;
      count.good1.count = count.good1.quantity + count.good1.profit - count.good1.disfee;
      setDisgoodCot(count);
      console.log(count, 999)
    } else {
      let num = Number(e.target.value);
      let num1 = disgood.good1.unitV / disgood.good2.unitV * num;
      if (num < disgood.good1.quantity && num < disgood.good1.maxNum && num1 < disgood.good2.quantity && num1 < disgood.good2.maxNum) {
        setGoodQ(e.target.value);
        setGoodVQ(num1);
      } else {
        setGoodQ(goodQ);
        setGoodVQ(goodVQ);
        num = Number(goodQ);
        num1 = Number(goodVQ);
      }
      count.good1.quantity = num;
      count.good1.profit = disgood.good1.nowUnitFee * num - num / disgood.good1.quantity * disgood.good1.contructFee;
      count.good1.disfee = num * disgood.good1.rate;
      count.good1.count = count.good1.quantity + count.good1.profit - count.good1.disfee;
      count.good2.quantity = num1;
      count.good2.profit = disgood.good2.nowUnitFee * num1 - num1 / disgood.good2.quantity * disgood.good2.contructFee;
      count.good2.disfee = num1 * disgood.good2.rate;
      count.good2.count = count.good2.quantity + count.good2.profit - count.good2.disfee;
      setDisgoodCot(count);

    }

  };
  const goodVQOn = (e) => {

    let num1 = Number(e.target.value);
    let num = disgood.good2.unitV / disgood.good1.unitV * num1;
    if (num < disgood.good1.quantity && num < disgood.good1.maxNum && num1 < disgood.good2.quantity && num1 < disgood.good2.maxNum) {
      setGoodQ(num);
      setGoodVQ(e.target.value);
    } else {
      setGoodQ(goodQ);
      setGoodVQ(goodVQ);
      num = Number(goodQ);
      num1 = Number(goodVQ);
    }
    count.good1.quantity = num;
    count.good1.profit = disgood.good1.nowUnitFee * num - num / disgood.good1.quantity * disgood.good1.contructFee;
    count.good1.disfee = num * disgood.good1.rate;
    count.good1.count = count.good1.quantity + count.good1.profit - count.good1.disfee;
    count.good2.quantity = num1;
    count.good2.profit = disgood.good2.nowUnitFee * num1 - num1 / disgood.good2.quantity * disgood.good2.contructFee;
    count.good2.disfee = num1 * disgood.good2.rate;
    count.good2.count = count.good2.quantity + count.good2.profit - count.good2.disfee;
    setDisgoodCot(count);

  };
  return (
    <>
      {contextHolder}
      <CreatModal open={open_zt} setOpen={setOpen} title={'disinvest'}>
        <Spin spinning={spinning} fullscreen indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} size="large" />
        {disgood.id !== 0 && (
          <div className='newgood'>
            <div>
              {/* {disgood} */}
              <div className='pt-2 pb-2'>
                <div className='flex justify-between items-center'>
                  <div><Space><Avatar src={<img src={disgood.good1.logo_url} alt="avatar" onError={(e) => {
                    e.currentTarget.src =
                      "/token.svg";
                  }} />} /><span>{disgood.good1.symbol}</span></Space></div>
                  <div><span>Current unit handling fee{prettifyCurrencys(disgood.good1.nowUnitFee)}</span></div>
                </div>
                <div className='pt-2 pb-2'>
                  <div><Space><span>Invest quantity:</span><span>{prettifyCurrencys(disgood.good1.quantity)}</span></Space></div>
                  <div><Space><span>Handling fees for investment units:</span><span>{prettifyCurrencys(disgood.good1.unitFee)}</span></Space></div>
                  <div><Space><span>Estimated return on investment:</span><span>{prettifyCurrencys(disgood.good1.profit)}</span></Space></div>
                  <div><Space><span>APY:</span><span>{prettifyCurrencys(disgood.good1.APY * 100)}%</span></Space></div>
                </div>
              </div>
              {!disgood.isvaluegood && (

                <div className='pt-2 pb-2'>
                  <div className='flex justify-between items-center'>
                    <div><Space><Avatar src={<img src={disgood.good2.logo_url} alt="avatar" onError={(e) => {
                      e.currentTarget.src =
                        "/token.svg";
                    }} />} /><span>{disgood.good2.symbol}</span></Space></div>
                    <div><span>Current unit handling fee{prettifyCurrencys(disgood.good2.nowUnitFee)}</span></div>
                  </div>
                  <div className='pt-2 pb-2'>
                    <div><Space><span>Invest quantity:</span><span>{prettifyCurrencys(disgood.good2.quantity)}</span></Space></div>
                    <div><Space><span>Handling fees for investment units:</span><span>{prettifyCurrencys(disgood.good2.unitFee)}</span></Space></div>
                    <div><Space><span>Estimated return on investment:</span><span>{prettifyCurrencys(disgood.good2.profit)}</span></Space></div>
                    <div><Space><span>APY:</span><span>{prettifyCurrencys(disgood.good2.APY * 100)}%</span></Space></div>
                  </div>
                </div>
              )}
            </div>

            <Form className='form-new' colon={false}>

              <h2>disinvest quantity</h2>
              <Form.Item>
                <Input
                  placeholder="0"
                  type='number'
                  onChange={goodQOn}
                  min={0}
                  max={disgood.good1.maxNum}
                  value={goodQ}
                  suffix={<Avatar src={<img src={disgood.good1.logo_url} alt="avatar" onError={(e) => {
                    e.currentTarget.src =
                      "/token.svg";
                  }} />} />}
                />
                <div className='pt-2 pb-2'>
                  <div className='flex justify-between'>
                    <div><Space><span>principal:</span><span>{prettifyCurrencys(disgoodCot.good1.quantity)}</span></Space></div>
                    <div><Space><span>profit:</span><span>{prettifyCurrencys(disgoodCot.good1.profit)}</span></Space></div>
                  </div>
                  <div className='text-end'><Space><span>fee:</span><span>{prettifyCurrencys(disgoodCot.good1.disfee)}</span></Space></div>
                  <div className='text-end'><Space><span>total:</span><span>{prettifyCurrencys(disgoodCot.good1.count)}</span></Space></div>
                </div>
              </Form.Item>
              {!disgood.isvaluegood && (
                <>
                  <h2>disinvest value</h2>
                  <Form.Item>
                    <Input
                      placeholder="0"
                      type='number'
                      min={0}
                      max={disgood.good2.maxNum}
                      onChange={goodVQOn}
                      value={goodVQ}
                      suffix={<Avatar src={<img src={disgood.good2.logo_url} alt="avatar" onError={(e) => {
                        e.currentTarget.src =
                          "/token.svg";
                      }} />} />}
                    />
                    <div className='pt-2 pb-2'>
                      <div className='flex justify-between'>
                        <div><Space><span>principal:</span><span>{prettifyCurrencys(disgoodCot.good2.quantity)}</span></Space></div>
                        <div><Space><span>profit:</span><span>{prettifyCurrencys(disgoodCot.good2.profit)}</span></Space></div>
                      </div>
                      <div className='text-end'><Space><span>fee:</span><span>{prettifyCurrencys(disgoodCot.good2.disfee)}</span></Space></div>
                      <div className='text-end'><Space><span>total:</span><span>{prettifyCurrencys(disgoodCot.good2.count)}</span></Space></div>
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
            >disinvest</Button>
          </div>
        )}
      </CreatModal>
    </>
  );
};
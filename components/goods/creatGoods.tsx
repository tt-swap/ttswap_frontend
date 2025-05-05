import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Form,
  Input,
  InputNumber,
  Select, Space, Avatar, Spin, message, Button, Switch
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
// import { Button } from "@/components/ui/button";
import CreatModal from "./creatModal";
import "./index.css"
import useWallet from "@/hooks/useWallet";
// import Message from '@/components/MessModal/index';
// import { useWeb3React } from "@web3-react/core";
// import { useSwitchChain } from "hooks";
import { useLocalStorage } from "@/utils/LocalStorageManager";
// import BigNumber from 'bignumber.js';
import { useMaxApprove } from '@/hooks/useMaxApprove';
import { useErrorMess } from '@/hooks/useErrorMess';

import { GoodsDatas } from '@/graphql';
import { getSWETH } from '@/data/contractConfig';

type SizeType = Parameters<typeof Form>[0]['size'];
const { Option } = Select;

interface Props {
  setDataNum: (value: number) => void;
}

export const CreatGoods = ({ setDataNum }: Props) => {
  const [spinning, setSpinning] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();
  const { maxApprove, setMaxApprove } = useMaxApprove();

  // const switchChain = useSwitchChain();
  // const { chainId } = useWeb3React();
  // @ts-ignore
  const { ssionChian } = useLocalStorage();
  const SWETH = getSWETH(ssionChian);
  const [open, setOpen] = useState(false);
  const [buyF, setBuyF] = useState(8);
  const [sellF, setSellF] = useState(8);
  const [inF, setInF] = useState(8);
  const [disinF, setDisinF] = useState(8);
  const [swapS, setSwapS] = useState(2);
  const [disinS, setDisinS] = useState(10);
  const [goodType, setGoodType] = useState("");
  const [goodInfo, setGoodInfo] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [goodQ, setGoodQ] = useState("");
  const [goodVQ, setGoodVQ] = useState("");
  const [goodC, setGoodC] = useState("");
  const [goodV, setGoodV] = useState("");
  const [goodVAddr, setGoodVAddr] = useState("");
  const [goodVName, setGoodVName] = useState("");
  const [goodDec, setGoodDec] = useState(0);
  const [selectVgood, setSelectVgood] = useState([]);

  const { checkContractExists, newGoods } = useWallet();
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      let tokens: any = await GoodsDatas(ssionChian);
      // console.log(tokens, 99)
      setGoodV(tokens[0].id);
      setGoodVAddr(tokens[0].address);
      setGoodVName(tokens[0].name);
      setGoodDec(tokens[0].decimals);
      setSelectVgood(tokens);
    })();
  }, [ssionChian]);

  useMemo(() => {
    setBuyF(8);
    setSellF(8);
    setInF(8);
    setDisinF(8);
    setSwapS(2);
    setDisinS(10);
    setGoodType("");
    setGoodInfo("");
    setLongitude("");
    setLatitude("");
    setGoodQ("");
    setGoodVQ("");
    setGoodC("");
    setGoodV("");
    setGoodVAddr("");
    setGoodDec(0);
  }, [open]);

  const isDisabled = useMemo(() => {
    // console.log(buyF, sellF, inF, disinF, swapS, disinS, goodQ, goodVQ, goodC, goodV)
    // @ts-ignore
    if (buyF < 1 || sellF < 1 || inF < 1 || disinF < 1 || swapS < 1 || disinS < 1 || goodQ === "" || goodQ === "0" || goodQ < 0 || goodVQ === "" || goodVQ === "0" || goodVQ < 0 || goodV === "" || goodC === "")
      return true;
    return false;
  }, [buyF, sellF, inF, disinF, swapS, disinS, goodQ, goodVQ, goodV])


  const newGood = async () => {
    setSpinning(true);
    // await switchChain(Number(ssionChian)).then(async () => {
    if (goodC === "0x0000000000000000000000000000000000000001" || goodC === "0x0000000000000000000000000000000000000002") { }
    else {
      let a = goodC;
      if (goodC === "0x0000000000000000000000000000000000000003") {
        a = SWETH;
      }
      const staust = await checkContractExists(a).then(exists => {
        if (exists) {
          console.log('合约存在');
          return true;
        } else {
          console.log('合约不存在');
          return false;
        }
      });
      if (!staust) {
        setSpinning(false);
        document.body.style.overflow = "";
        messageApi.open({
          type: 'error',
          content: t('common.mess.address.error'),
        });
        return
      };
      console.log(staust)
    }
    // @ts-ignore
    const config = inF * 2 ** 217 + disinF * 2 ** 211 + buyF * 2 ** 204 + sellF * 2 ** 197 + swapS * 2 ** 187 + disinS * 2 ** 177

    // @ts-ignore
    const isSuccess = await newGoods(goodVAddr, goodVName, goodV, goodDec, goodQ, goodVQ, goodC, BigInt(config).toString(), "0", maxApprove);
    console.log("isSuccess:", isSuccess, useErrorMess(isSuccess, t))
    if (isSuccess === true) {
      messageApi.open({
        type: 'success',
        content: t('common.mess.create') + t('common.mess.success'),
      });
      setDataNum(1);
      setOpen(false);
    } else if (isSuccess === false) {
      messageApi.open({
        type: 'error',
        content: t('common.mess.create') + t('common.mess.error'),
      });
    } else {
      messageApi.open({
        type: 'error',
        content: useErrorMess(isSuccess, t),
      });
    }
    // }).catch((error) => {
    //   console.error(`"Failed to switch chains: " ${error}`);
    // });
    setSpinning(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      {contextHolder}
      {/* <Message
        open={openM}
        status={mesStatus}
        title={mesTitle}
        setOpen={setOpenM}
      /> */}
      <Button
        size="large"
        type="primary"
        onClick={() => {
          setOpen(true)
        }}>
        {t('body.account.bnt.create')}
      </Button>
      <CreatModal open={open} setOpen={setOpen} title={t('body.account.create.title')}>

        <Spin spinning={spinning} fullscreen indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} size="large" />

        <div className='newgood'>
          <Form className='form-new' form={form} colon={false}>
            <h2>{t('body.account.create.contract')}</h2>
            <Form.Item>
              <Input
                placeholder={t('body.account.create.contract')}
                onChange={(e) => { setGoodC(e.target.value); }}
                value={goodC}
              />
            </Form.Item>
            <h2>{t('body.account.create.rateconfig')}</h2>
            <Space>
              <Form.Item label={t('body.account.create.buy')}
                rules={[{ required: true, message: 'Please input your username!' }]}>
                <InputNumber
                  addonAfter="‱"
                  min={1}
                  max={127}
                  step={1}
                  precision={0}
                  // @ts-ignore
                  onChange={(e) => { if (e > 0) setBuyF(e); }}
                  value={buyF}
                  defaultValue={8}
                />
              </Form.Item>
              <Form.Item label={t('body.account.create.sell')}>
                <InputNumber
                  addonAfter="‱"
                  min={1}
                  max={127}
                  step={1}
                  precision={0}
                  // @ts-ignore
                  onChange={(e) => { if (e > 0) setSellF(e); }}
                  value={sellF}
                  defaultValue={8}
                />
              </Form.Item>
            </Space>
            <Space>
              <Form.Item label={t('common.invest')}>
                <InputNumber
                  addonAfter="‱"
                  min={1}
                  max={63}
                  step={1}
                  precision={0}
                  // @ts-ignore
                  onChange={(e) => { if (e > 0) setInF(e); }}
                  value={inF}
                  defaultValue={8}
                />
              </Form.Item>
              <Form.Item label={t('common.divest')}>
                <InputNumber
                  addonAfter="‱"
                  min={1}
                  max={63}
                  step={1}
                  precision={0}
                  // @ts-ignore
                  onChange={(e) => { if (e > 0) setDisinF(e); }}
                  value={disinF}
                  defaultValue={8}
                />
              </Form.Item>
            </Space>
            <h2>{t('body.account.create.chips')}</h2>
            <Space className='spanS'>
              <Form.Item label={t('common.swap')}>
                <InputNumber
                  // addonAfter="x64"
                  min={2}
                  step={1}
                  precision={0}
                  // @ts-ignore
                  onChange={(e) => { if (e > 1) setSwapS(e); }}
                  value={swapS}
                  defaultValue={2}
                />{" x10"}
              </Form.Item>
              <Form.Item label={t('common.divest')}>
                <InputNumber
                  min={10}
                  step={1}
                  precision={0}
                  // @ts-ignore
                  onChange={(e) => { if (e > 10) setDisinS(e); }}
                  value={disinS}
                  defaultValue={10}
                />
              </Form.Item>
            </Space>
            {/* <h2>other</h2>
            <Form.Item>
              <Select
                placeholder="type"
                onChange={(e) => { setGoodType(e); }}
                value={goodType}>
                <Select.Option value="demo">Demo</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Input
                placeholder="contact information"
                onChange={(e) => { setGoodInfo(e.target.value); }}
                value={goodInfo} />
            </Form.Item>
            <Form.Item>
              <Input
                placeholder="longitude"
                onChange={(e) => { setLongitude(e.target.value); }}
                value={longitude} />
            </Form.Item>
            <Form.Item>
              <Input
                placeholder="latitude"
                onChange={(e) => { setLatitude(e.target.value); }}
                value={latitude} />
            </Form.Item> */}
            <h2>{t('body.account.create.choose')}</h2>
            <Form.Item>
              <Select
                placeholder={t('body.account.create.choose')}
                optionLabelProp="label"
                value={goodV}
                onChange={(e) => {
                  // @ts-ignore
                  const op: any = selectVgood.find(option => option.id === e)
                  setGoodV(e);
                  setGoodVAddr(op.address);
                  setGoodDec(op.decimals);
                }}
              >
                {selectVgood.map(item => (
                  // @ts-ignore
                  <Option key={item.id} value={item.id} label={item.symbol}>
                    <div>
                      <Avatar size="small" src={
                        // @ts-ignore
                        <img src={item.logo_url ?? "/token.svg"} alt="avatar" onError={(e) => {
                          e.currentTarget.src =
                            "/token.svg";
                        }} />}>
                      </Avatar>{" "}
                      {
                        // @ts-ignore
                        item.symbol}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <h2>{t('body.account.create.quanity')}</h2>
            <Form.Item>
              <Input
                placeholder="0"
                type='number'
                onChange={(e) => { setGoodQ(e.target.value); }}
                value={goodQ}
              />
            </Form.Item>
            <h2>{t('body.account.create.value')}</h2>
            <Form.Item>
              <Input
                placeholder="0"
                type='number'
                min={1}
                onChange={(e) => { setGoodVQ(e.target.value); }}
                value={goodVQ}
              />
            </Form.Item>
            <Form.Item>
              <div className=" flex justify-between gap-4">
                <p>
                  {t('body.swap.tolerance.maxApprove')}
                </p>
                <Switch value={maxApprove} onChange={(checked: boolean) => setMaxApprove(checked)} />
              </div>
            </Form.Item>
          </Form>
          <Button
            type="primary"
            style={{ width: "100%" }}
            disabled={isDisabled}
            onClick={newGood}
          >{t('body.account.create.bnt')}</Button>
        </div>
      </CreatModal>
    </>
  );
};
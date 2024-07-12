import React, { useState, useMemo, useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select, Space, Avatar, Spin, message
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Button } from "@/components/ui/button";
import CreatModal from "./creatModal";
import "./index.css"
import useWallet from "@/hooks/useWallet";

import { GoodsDatas } from '@/graphql';

type SizeType = Parameters<typeof Form>[0]['size'];
const { Option } = Select;

interface Props {
  setDataNum: (value: number) => void;
}

export const CreatGood = ({ setDataNum }: Props) => {
  const [spinning, setSpinning] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

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
  const [goodDec, setGoodDec] = useState(0);
  const [selectVgood, setSelectVgood] = useState([]);

  const { newGoods } = useWallet();
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      let tokens: any = await GoodsDatas();
      // console.log(tokens, 99)
      setGoodV(tokens[0].id);
      setGoodVAddr(tokens[0].address);
      setGoodDec(tokens[0].decimals);
      setSelectVgood(tokens);
    })();
  }, []);

  const isDisabled = useMemo(() => {
    console.log(buyF, sellF, inF, disinF, swapS, disinS, goodQ, goodVQ, goodC, goodV)
    // @ts-ignore
    if (buyF < 1 || sellF < 1 || inF < 1 || disinF < 1 || swapS < 1 || disinS < 1 || goodQ === "" || goodQ === "0" || goodQ < 0 || goodVQ === "" || goodVQ === "0" || goodVQ < 0 || goodV === ""|| goodC === "")
      return true;
    return false;
  }, [buyF, sellF, inF, disinF, swapS, disinS, goodQ, goodVQ, goodV])


  const newGood = async () => {
    setSpinning(true);
    console.log(0)
    // @ts-ignore
    const qunt = Number(goodQ * 2 ** 128 + goodVQ)
    const config = inF * 2 ** 246 + disinF * 2 ** 240 + buyF * 2 ** 233 + sellF * 2 ** 226 + swapS * 2 ** 216 + disinS * 2 ** 206
    const isSuccess = await newGoods(goodVAddr, goodV, goodDec, goodQ, goodVQ, goodC, BigInt(config).toString(), "0");
    // const isSuccess = await newGoods("0x5FC8d32690cc91D4c39d9d3abcBD16989F875707", "14700013424982216455688397208100595100161518504028027706369398309082945288267", goodDec, goodQ, goodVQ, goodC, BigInt(config).toString(), "0")
    // form.resetFields();
  console.log("isSuccess:",isSuccess)
    if (isSuccess) {
      messageApi.open({
        type: 'success',
        content: 'Creat data sent sucess',
      });
      setDataNum(1);
      setOpen(false);
    } else {
      messageApi.open({
        type: 'error',
        content: 'Creat data sent fail',
      });
    }
    setSpinning(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      {contextHolder}
      <Button className='newButton' onClick={() => {
        setOpen(true)
      }}>
        new good
      </Button>
      <CreatModal open={open} setOpen={setOpen} title={'creat good'}>

        <Spin spinning={spinning} fullscreen indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} size="large" />

        <div className='newgood'>
          <Form className='form-new' form={form} colon={false}>
            <h2>contract address</h2>
            <Form.Item>
              <Input
                placeholder="contract address"
                onChange={(e) => { setGoodC(e.target.value); }}
                value={goodC}
              />
            </Form.Item>
            <h2>rate config(not null)</h2>
            <Space>
              <Form.Item label="buy"
                rules={[{ required: true, message: 'Please input your username!' }]}>
                <InputNumber
                  addonAfter="‱"
                  min={1}
                  step={1}
                  precision={0}
                  // @ts-ignore
                  onChange={(e) => { if (e > 0) setBuyF(e); }}
                  value={buyF}
                  defaultValue={8}
                />
              </Form.Item>
              <Form.Item label="sell">
                <InputNumber
                  addonAfter="‱"
                  min={1}
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
              <Form.Item label="invest">
                <InputNumber
                  addonAfter="‱"
                  min={1}
                  step={1}
                  precision={0}
                  // @ts-ignore
                  onChange={(e) => { if (e > 0) setInF(e); }}
                  value={inF}
                  defaultValue={8}
                />
              </Form.Item>
              <Form.Item label="disinvest">
                <InputNumber
                  addonAfter="‱"
                  min={1}
                  step={1}
                  precision={0}
                  // @ts-ignore
                  onChange={(e) => { if (e > 0) setDisinF(e); }}
                  value={disinF}
                  defaultValue={8}
                />
              </Form.Item>
            </Space>
            <h2>section config(not null)</h2>
            <Space className='spanS'>
              <Form.Item label="swap">
                <InputNumber
                  min={2}
                  step={1}
                  precision={0}
                  // @ts-ignore
                  onChange={(e) => { if (e > 1) setSwapS(e); }}
                  value={swapS}
                  defaultValue={2}
                />
              </Form.Item>
              <Form.Item label="disinvest">
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
            {/* <Form.Item>
              <Space>
                <InputNumber addonBefore="swap" defaultValue={3 * 64} />
                <InputNumber addonBefore="disinvest" defaultValue={100} />
              </Space>
            </Form.Item> */}
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
            <h2>choice Value good</h2>
            <Form.Item>
              <Select
                placeholder="choice Value good"
                optionLabelProp="label"
                value={goodV}
                onChange={(e) => {
                  const op: any = selectVgood.find(option => option.id === e)
                  setGoodV(e);
                  setGoodVAddr(op.address);
                  setGoodDec(op.decimals);
                }}
              >
                {selectVgood.map(item => (
                  <Option key={item.id} value={item.id} label={item.symbol}>
                    <div>
                      <Avatar size="small" src={<img src={item.logo_url ?? "/token.svg"} alt="avatar" onError={(e) => {
                        e.currentTarget.src =
                          "/token.svg";
                      }} />}>
                      </Avatar>{" "}
                      {item.symbol}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <h2>invest quantity</h2>
            <Form.Item>
              <Input
                placeholder="0"
                type='number'
                onChange={(e) => { setGoodQ(e.target.value); }}
                value={goodQ}
              />
            </Form.Item>
            <h2>invest value</h2>
            <Form.Item>
              <Input
                placeholder="0"
                type='number'
                min={1}
                onChange={(e) => { setGoodVQ(e.target.value); }}
                value={goodVQ}
              />
            </Form.Item>
          </Form>
          <Button
            className='newButton'
            style={{ width: "100%" }}
            disabled={isDisabled}
            onClick={newGood}
          >new</Button>
        </div>
      </CreatModal>
    </>
  );
};
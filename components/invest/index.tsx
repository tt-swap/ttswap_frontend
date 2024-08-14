import useInvest from "@/hooks/useInvest";
import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { cn } from "@/utils/utils";
import TokenInvestSelector from "./TokenInvestSelector";
import useWallet from "@/hooks/useWallet";
import InputNumber from "rc-input-number";
import { useMemo, useState, useEffect } from "react";
// import { useWeb3React } from "@web3-react/core";

import { useWeb3React } from "@web3-react/core";
import { useSwitchChain } from "hooks";
import { useValueGood, useGoodId } from "@/stores/valueGood";
import { Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import "./index.css";
import Message from '@/components/MessModal/index';

import { useLocalStorage } from "@/utils/LocalStorageManager";

import { powerIterative, prettifyBalance } from '@/graphql/util';
import { GoodsDatas } from '@/graphql/invest';
import { newGoodsPrice } from '@/graphql/swap/index';


// git提交描述
// swap module overall change adjustment；
// ﻿graphql catalog optimization and adjustment.

const styles = {
  wrapper:
    "wrapper md:w-full h-[100vh] flex justify-center items-center p-4 md:p-0",
  boxContainer: //"relative w-full h-[480px] max-w-md p-8 bg-white rounded-2xl shadow-md border border-gray-200",
    "relative w-full max-w-lg p-6 bg-white rounded-2xl shadow-md border border-gray-200",
  arrowButton:
    "text-gray-500 z-1 absolute top-[41%] z-10 px-4 py-2 rounded-md  focus:outline-none transition-all duration-300",
  form: "space-y-4 z-2 text-black",
  swapButton: `w-full text-black 
        color-[#f0f8ff]
        bg-gradient-to-r from-[#83e3d6] to-[#a9f4d3] 
        disabled:bg-gradient-to-r disabled:from-[#919496] disabled:to-[#d8e0e0] disabled:shadow-none 
        hover:bg-gradient-to-br 
        focus:outline-none 
        shadow-lg shadow-[#a9f4d3]/50 dark:shadow-lg dark:shadow-[#a9f4d3]/80 
        font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2`,
  input:
    "*:*:w-full *:*:outline-none text-black text-3xl border-none mt-1 p-2 border w-[70%] rounded-md outline-none focus:border-blue-500 disabled:*:*:bg-white disabled:*:*:cursor-not-allowed disabled:*:*:opacity-50 bg-white",
  price: "w-full text-black flex flex-row justify-between px-3",
  label: "block px-2 text-sm font-medium text-black",
  inputWrapper: "w-full flex flex-row gap-12",
  balance: "p-2 flex justify-between text-sm",
};

const TokenInvest = () => {
  const {
    invest,
    investAmount,
    // fromPrice,
    // toPrice,
    setAmount,
    setToken,
    disabled,
  } = useInvest();
  const { balanceMap1, investGoods } = useWallet();

  // const { isActive, account } = useWeb3React();

  const switchChain = useSwitchChain();
  const { chainId } = useWeb3React();

  const [balanceF, setBalanceF] = useState<string | number>(0);
  const [balanceT, setBalanceT] = useState<string | number>(0);
  const [isValueGood, setIsValueGood] = useState(true);

  const [spinning, setSpinning] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { info } = useValueGood();
  const { goodId } = useGoodId();

  const [open, setOpen] = useState(false);
  const [mesStatus, setMesStatus] = useState("");
  const [mesTitle, setMesTitle] = useState("");
  // @ts-ignore
  const { ssionChian } = useLocalStorage();
  const [amountSp, setAmountSp] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [focus, setFocus] = useState("from");

  const isDisabled = useMemo(() => {
    if (isValueGood) {
      // @ts-ignore
      if (investAmount.from.amount > balanceMap1.from || balanceMap1.from === 0 || investAmount.from.amount === 0 || investAmount.from.amount < 0 || investAmount.from.amount === "") {
        return true;
      }
      return disabled;
    } else {
      // @ts-ignore
      if (investAmount.from.amount > balanceMap1.from || investAmount.to.amount > balanceMap1.to || balanceMap1.from === 0 || balanceMap1.to === 0 || investAmount.from.amount === 0 || investAmount.from.amount < 0 || investAmount.from.amount === "" || disabled) {
        return true;
      }
      return disabled;
    }
    // return disabled;
  }, [investAmount.from.amount, disabled, balanceMap1]);
  // console.log(9999,isDisabled,investAmount.from.amount)

  useMemo(() => {
    // @ts-ignore
    setBalanceF(balanceMap1.from); setBalanceT(balanceMap1.to);
  }, [balanceMap1, ssionChian]);

  useMemo(() => {
    if (info.id) {
      (async () => {
        let sel = "";
        if (goodId.invest.id !== "") {
          // 
          sel = goodId.invest.id;
        }
        let tokens: any = await GoodsDatas({
          id: info.id,
          sel: sel
        }, ssionChian);
        if (goodId.invest.id !== "") {
          // 
          setToken("from", tokens.tokens[0].children[0]);
          setIsValueGood(tokens.tokens[0].children[0].isvaluegood);
        } else {
          setToken("from", tokens.tokenValue[0]);
          setIsValueGood(tokens.tokenValue[0].isvaluegood);
        }
      })();
    }
  }, [info, ssionChian]);

  useEffect(() => {
    goodsF();
  }, [invest]);

  const setAmounts = (type: string, value: any) => {
    setFocus(type);
    if (value > 0) {
      setAmountSp(true)
      // @ts-ignore
      clearTimeout(timerId);
      let timer = setTimeout(async () => {
        // @ts-ignore
        const datas = await newGoodsPrice({ id: info.id, from: invest.from.id, to: invest.to.id }, ssionChian);
        setAmount(type, value, datas);
        clearTimeout(timer);
        setAmountSp(false)
      }, 1000);
      // @ts-ignore
      setTimerId(timer);
    } else {
      setAmount(type, value, 0);
    }
  };

  const goodsF = () => {
    let amount;
    let type;
    if (focus === "from") {
      amount = investAmount.from.amount;
      type = "to";
    } else {
      amount = investAmount.to.amount;
      type = "from";
    }
    setAmounts(focus, amount);
  };

  const handleInvest = async () => {
    await switchChain(ssionChian).catch((error) => {
      console.error(`"Failed to switch chains: " ${error}`);
    });
    if (chainId !== ssionChian) {
      return;
    }

    setSpinning(true);
    let fAmount = 0;
    let tAmount = 0;
    if (investAmount.from.amount !== "" && investAmount.from.amount > 0) {
      fAmount = investAmount.from.amount * powerIterative(10, invest.from.decimals);
    }
    if (investAmount.to.amount !== "" && investAmount.to.amount > 0 && !isValueGood) {
      tAmount = investAmount.to.amount * powerIterative(10, invest.to.decimals);
    }
    const isSuccess = await investGoods(invest, BigInt(fAmount), BigInt(tAmount), isValueGood);
    // console.log(fAmount, investAmount.to.amount)
    // const invests = { from: { id: "10914194096696494602201439900139420285172543535010108149566946845398245456564", address: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9" }, to: { id: "14700013424982216455688397208100595100161518504028027706369398309082945288267", address: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707" } };
    // const isSuccess = await investGoods(invests, BigInt(fAmount).toString(), BigInt(tAmount).toString(), isValueGood);

    if (isSuccess) {
      setOpen(true);
      setMesStatus("success");
      setMesTitle("Invest data send success");
      setAmount("from", "", 0);
      // messageApi.open({
      //   type: 'success',
      //   content: 'Invest data send success',
      // });
    } else {
      setOpen(true);
      setMesStatus("error");
      setMesTitle("Invest data send fail");
      // messageApi.open({
      //   type: 'error',
      //   content: 'Invest data send fail',
      // });
    }
    setSpinning(false);
  };
  return (
    <>
      {/* {contextHolder} */}
      <Message
        open={open}
        status={mesStatus}
        title={mesTitle}
        setOpen={setOpen}
      />
      <Spin spinning={spinning} fullscreen indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} size="large" />
      <div className={""} >
        <div className={cn(styles.boxContainer, "box-shadow")}>
          <form className={styles.form}>
            <div className="flex justify-between h-[30px]">
              <h5 className="text-2xl font-semibold mb-4">Invest</h5>
            </div>
            <div
              className="border z-11 rounded-xl p-2 space-y-4"
            >
              <label className={styles.label}>
                Goods
              </label>
              <div className="swToFT">
                <InputNumber
                  disabled={invest.from.symbol === DEFAULT_TOKEN}
                  // width={85}
                  min={0}
                  type="number"
                  max={999999999}
                  pattern="[0-9]*[.]?[0-9]+"
                  name={"from"}
                  value={investAmount.from.amount}
                  onChange={(e) => { setAmounts("from", e); }}
                  className={styles.input}
                  controls={false}
                  placeholder="0"
                />
                <TokenInvestSelector
                  value={invest.from}
                  isValue={true}
                  onChange={(val) => {
                    setToken("from", val);
                    setIsValueGood(val.isvaluegood);
                  }}
                />
              </div>
              <div className={styles.balance}>
                <span className="flex">
                  <Spin
                    spinning={amountSp}
                    indicator={<LoadingOutlined spin />}
                    size="small">
                    {investAmount.from.price > 0 ? investAmount.from.price : 0}{" " + info.symbol}{" "}
                  </Spin>
                  {/* {investAmount.from.price > 0 ? investAmount.from.price : 0}{" " + info.symbol}{" "} */}
                  {investAmount.from.price !== 0 &&
                    invest.from.symbol !== DEFAULT_TOKEN && (
                      <span className="text-[#63ae8e] ml-2">{invest.from.investFee * 100}%</span>
                    )}
                </span>
                <span
                  className={cn(
                    invest.from.symbol !== DEFAULT_TOKEN &&
                    investAmount.from.amount >
                    balanceF &&
                    "text-red-500 shake"
                  )}
                >
                  Balance:{" "}
                  <span
                    className="cursor-pointer"
                    onClick={() =>
                      // @ts-ignore
                      setAmount("from", balanceF)
                    }
                  >
                    {invest.from.symbol !== DEFAULT_TOKEN
                      ? prettifyBalance(Number(balanceF))
                      : 0}
                  </span>
                </span>
              </div>
            </div>
            {!isValueGood && (

              <div
                // key={invest.from.symbol + 0}
                className="border z-11 rounded-xl p-2"
              >
                <label className={styles.label}>
                  ValueGoods (estimated)
                </label>
                <div className="swToFT">
                  <InputNumber
                    disabled={invest.from.symbol === DEFAULT_TOKEN || invest.to.symbol === DEFAULT_TOKEN}
                    width={85}
                    min={0}
                    type="number"
                    max={999999999}
                    pattern="[0-9]*[.,]?[0-9]+"
                    name={"to"}
                    value={investAmount.to.amount}
                    onChange={(e) => { setAmounts("to", e); }}
                    className={styles.input}
                    controls={false}
                    placeholder="0"
                  />
                  <TokenInvestSelector
                    value={invest.to}
                    isValue={isValueGood}
                    onChange={(val) => setToken("to", val)}
                  />
                </div>
                <div className={styles.balance}>
                  <span className="flex">
                    {invest.to.symbol !== DEFAULT_TOKEN ? (
                      <Spin
                        spinning={amountSp}
                        indicator={<LoadingOutlined spin />}
                        size="small">
                        {investAmount.to.price > 0 ? investAmount.to.price : 0}{" " + info.symbol}{" "}
                      </Spin>
                    ) : (
                      <span>{investAmount.to.price > 0 ? investAmount.to.price : 0}{" " + info.symbol}{" "}</span>
                    )}
                    {/* {investAmount.to.price > 0 ? investAmount.to.price : 0}{" " + info.symbol}{" "} */}
                    {investAmount.to.price !== 0 &&
                      invest.to.symbol !== DEFAULT_TOKEN && (
                        <span className="text-[#63ae8e] ml-2">{invest.to.investFee * 100}%</span>
                      )}
                  </span>
                  <span
                    className={cn(
                      invest.to.symbol !== DEFAULT_TOKEN &&
                      investAmount.to.amount >
                      balanceT &&
                      "text-red-500 shake"
                    )}
                  >
                    Balance:{" "}
                    <span
                      className="cursor-pointer"
                      onClick={() =>
                        // @ts-ignore
                        setAmount("to", balanceT)
                      }
                    >
                      {invest.to.symbol !== DEFAULT_TOKEN
                        ? prettifyBalance(Number(balanceT))
                        : 0}
                    </span>
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleInvest}
              type="button"
              disabled={isDisabled}
              className={cn(styles.swapButton, disabled && "text-[#c5f0ea]")}
              style={{ marginTop: "10px" }}
            >
              Invest {!isDisabled && "✨"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default TokenInvest;

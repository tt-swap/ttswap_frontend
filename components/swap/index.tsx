import assets from "@/assets";
import useSwap from "@/hooks/useSwap";
import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { cn } from "@/utils/utils";
import TokenSwapSelector from "./TokenSwapSelector";
import TokenSwapSetting from "./TokenSwapSetting";
import useWallet from "@/hooks/useWallet";
import InputNumber from "rc-input-number";
import { useMemo, useEffect, useState } from "react";

import { ArrowDownOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Collapse } from 'antd';
import type { CollapseProps } from 'antd';

import { splitNumber } from '@/graphql/util';
import { GoodsDatas } from '@/graphql/swap/index';

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
  balance: "px-2 flex justify-between text-sm",
};

const TokenSwap = () => {
  const {
    swaps,
    computedPrice,
    handleSwap,
    setAmount,
    setToken,
    handleFlip,
    swapArray,
    disabled,
  } = useSwap();
  const { balanceMap } = useWallet();

  const isDisabled = useMemo(() => {
    if (!balanceMap[swaps.from.token]) {
      return disabled;
    }
    return swaps.from.amount > balanceMap[swaps.from.token].balance || disabled;
  }, [swaps.from.amount, disabled, balanceMap[swaps.from.token]]);

  const [isFees, setFees] = useState(false);
  const [istotal, setIstotal] = useState(false);
  const [tolerance, setTolerance] = useState(0.5);


  const handleFees = () => {
    if (isFees) {
      setFees(false);
    } else {
      setFees(true);
    }
  };
  // useEffect(() => {
  //   (async () => {
  //     console.log(await GoodsDatas({ id: 1 }), 9999)
  //   })();
  // })
  // console.log(balanceMap)
  return (
    <div className={""} >
      <div className={cn(styles.boxContainer, "box-shadow")}>

        <form className="">
          <div className="flex justify-between h-[30px]">
            <h5 className="text-2xl font-semibold mb-4">Swap Token</h5>
            <TokenSwapSetting
              value={tolerance}
              value1={istotal}
              onChange={(val,val1) => {
                setTolerance(val)
                setIstotal(val1)
              }}
            />
          </div>
          {/* <FlipMove> */}
          {/* {swapArray.map((el, index) => {
              console.log(el,111)
              return (
                
              );
            })} */}
          <div
            key={swaps["from"].token + 0}
            className="border z-11 rounded-xl p-2 space-y-4"
            style={{ marginTop: "20px" }}
          >
            <label className={styles.label}>
              From
            </label>
            <div className="swToFT">
              <InputNumber
                // disabled={swaps["from"].token === DEFAULT_TOKEN}
                // width={85}
                min={0}
                type="number"
                max={999999999}
                pattern="[0-9]*[.]?[0-9]+"
                name={"from"}
                value={swaps["from"].amount}
                onChange={(e) => setAmount("from", e || 0)}
                className={styles.input}
              />
              <TokenSwapSelector
                value={"ATOM"}
                onChange={(val) => setToken("from", val)}
              />
            </div>
            <div className={styles.balance}>
              <span>
                ${computedPrice}{" "}
                {computedPrice !== 0 &&
                  swaps["from"].token !== DEFAULT_TOKEN && (
                    <span className="text-[#63ae8e] ml-2">0,05%</span>
                  )}
              </span>
              {/* <span
                  className={cn(
                    swaps["from"].token !== DEFAULT_TOKEN &&
                    swaps["from"].amount >
                    balanceMap[swaps["from"].token].balance &&
                    "text-red-500 shake"
                  )}
                > */}
              {/* Balance:{" "} */}
              {/* <span
                    className="cursor-pointer"
                  // onClick={() =>
                  //   setAmount(el, balanceMap[swaps["from"].token].balance)
                  // }
                  >
                    {swaps["from"].token !== DEFAULT_TOKEN
                      ? balanceMap[swaps["from"].token].balance
                      : 0}
                  </span> */}
              {/* </span> */}
            </div>
          </div>
          <div className="swapBut">
            <Button
              className="swapButSt"
              icon={<ArrowDownOutlined />}
              onClick={handleFlip}
            >
            </Button>
          </div>
          <div
            key={swaps["from"].token + 0}
            className="border z-11 rounded-xl p-2"
          >
            <label className={styles.label}>
              To (estimated)
            </label>
            <div className="swToFT">
              <InputNumber
                disabled={swaps["to"].token === DEFAULT_TOKEN}
                width={85}
                min={0}
                type="number"
                max={999999999}
                pattern="[0-9]*[.,]?[0-9]+"
                name={"to"}
                value={swaps["to"].amount}
                // onChange={(e) => setAmount("from", e || 0)}
                className={styles.input}
              />
              <TokenSwapSelector
                value={swaps["to"].token}
                onChange={(val) => setToken("to", val)}
              />
            </div>
            <div className={styles.balance}>
              <span>
                ${computedPrice}{" "}
                {computedPrice !== 0 &&
                  swaps["to"].token !== DEFAULT_TOKEN && (
                    <span className="text-[#63ae8e] ml-2">0,05%</span>
                  )}
              </span>
              <span
                className={cn(
                  swaps["to"].token !== DEFAULT_TOKEN &&
                  swaps["to"].amount >
                  balanceMap[swaps["to"].token].balance &&
                  "text-red-500 shake"
                )}
              >
                Balance:{" "}
                <span
                  className="cursor-pointer"
                // onClick={() =>
                //   setAmount(el, balanceMap[swaps["from"].token].balance)
                // }
                >
                  {swaps["to"].token !== DEFAULT_TOKEN
                    ? balanceMap[swaps["to"].token].balance
                    : 0}
                </span>
              </span>
            </div>
          </div>
          {/* </FlipMove> */}

          <button
            onClick={handleSwap}
            type="button"
            disabled={isDisabled}
            className={cn(styles.swapButton, disabled && "text-[#c5f0ea]")}
            style={{ marginTop: "10px" }}
          >
            Swap {!isDisabled && "✨"}
          </button>
        </form>
        <div>
          <div>
            <div className="flex justify-between">
              <div>Price impact warning</div>
              <div>-33.55%</div>
            </div>
          </div>
        </div>
        <div className="p-4 text-sm">
          {/* <span>Price</span> <span>${computedPrice}</span> */}
          <div className="flex cursor-pointer justify-between"
            onClick={handleFees}>
            <div>1 DAI = 0.00029 ETH($1.00)</div>
            <div>
              {isFees && (
                <UpOutlined />
              )}
              {!isFees && (
                <DownOutlined />
              )}
            </div>
          </div>
          {isFees && (
            <div>
              <div className="se pt-4">
                <div className="flex justify-between">
                  <div>Price impact</div>
                  <div>-33.55%</div>
                </div>
                <div className="flex justify-between">
                  <div>Tolerance</div>
                  <div>0.5%</div>
                </div>
                <div className="flex justify-between">
                  <div>Fee</div>
                  <div>0.1%</div>
                </div>
                <div className="flex justify-between">
                  <div>Network cost</div>
                  <div>11 Usdt</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenSwap;

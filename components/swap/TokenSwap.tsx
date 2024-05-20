import assets from "@/assets";
import useSwap from "@/hooks/useSwap";
import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { cn } from "@/utils/utils";
import FlipMove from "react-flip-move";
import TokenSwapSelector from "./TokenSwapSelector";
import TokenSwapSetting from "./TokenSwapSetting";
import useWallet from "@/hooks/useWallet";
import InputNumber from "rc-input-number";
import { useMemo } from "react";

const styles = {
  wrapper:
    "wrapper md:w-full h-[100vh] flex justify-center items-center p-4 md:p-0",
  boxContainer:
    "relative w-full h-[480px] max-w-md p-8 bg-white rounded-2xl shadow-md",
  arrowButton:
    "text-gray-500 z-1 absolute top-[41%] z-10 px-4 py-2 rounded-md  focus:outline-none transition-all duration-300",
  form: "space-y-4 z-2 text-gray-600",
  swapButton: `w-full text-gray-600 
        color-[#f0f8ff]
        bg-gradient-to-r from-[#83e3d6] to-[#a9f4d3] 
        disabled:bg-gradient-to-r disabled:from-[#919496] disabled:to-[#d8e0e0] disabled:shadow-none 
        hover:bg-gradient-to-br 
        focus:outline-none 
        shadow-lg shadow-[#a9f4d3]/50 dark:shadow-lg dark:shadow-[#a9f4d3]/80 
        font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2`,
  input:
    "*:*:w-full *:*:outline-none text-gray-600 text-3xl border-none mt-1 p-2 border w-[70%] rounded-md outline-none focus:border-blue-500 disabled:*:*:bg-white disabled:*:*:cursor-not-allowed disabled:*:*:opacity-50",
  price: "w-full text-gray-600 flex flex-row justify-between px-3",
  label: "block px-2 text-sm font-medium text-gray-600",
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

  return (
    <div className={styles.wrapper}>
      <div className={cn(styles.boxContainer, "box-shadow")}>
        <button
          type="button"
          onClick={handleFlip}
          className={styles.arrowButton}
        >
          {/* <img className="w-6" src={assets.arrow} alt="aa" /> */}
          <img className="w-6" src={"/arrow.svg"} alt="aa" />
        </button>
        <form className={styles.form}>
          <div className="flex justify-between h-[30px]">
            <h5 className="text-2xl font-semibold mb-4">Swap</h5>
            <TokenSwapSetting />
          </div>
          <FlipMove>
            {swapArray.map((el, index) => {
              return (
                <div
                  key={swaps[el].token + index}
                  className={`border z-11 rounded-xl p-2 ${
                    index == 0 && "mb-12"
                  }`}
                >
                  <label className={styles.label}>
                    {index === 0 ? "From" : "To (estimated)"}
                  </label>
                  <div className={styles.inputWrapper}>
                    <InputNumber
                      disabled={swaps[el].token === DEFAULT_TOKEN}
                      width={85}
                      min={0}
                      type="number"
                      max={999999999}
                      pattern="[0-9]*[.,]?[0-9]+"
                      name={el}
                      value={swaps[el].amount}
                      onChange={(e) => setAmount(el, e || 0)}
                      className={styles.input}
                    />
                    <TokenSwapSelector
                      value={swaps[el].token}
                      onChange={(val) => setToken(el, val)}
                    />
                  </div>
                  <div className={styles.balance}>
                    <span>
                      ${computedPrice}{" "}
                      {computedPrice !== 0 &&
                        swaps[el].token !== DEFAULT_TOKEN && (
                          <span className="text-[#63ae8e] ml-2">0,05%</span>
                        )}
                    </span>
                    <span
                      className={cn(
                        index === 0 &&
                          swaps[el].token !== DEFAULT_TOKEN &&
                          swaps[el].amount >
                            balanceMap[swaps[el].token].balance &&
                          "text-red-500 shake"
                      )}
                    >
                      Balance:{" "}
                      <span
                        className="cursor-pointer"
                        onClick={() =>
                          setAmount(el, balanceMap[swaps[el].token].balance)
                        }
                      >
                        {swaps[el].token !== DEFAULT_TOKEN
                          ? balanceMap[swaps[el].token].balance
                          : 0}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </FlipMove>
          <div className={styles.price}>
            <span>Price</span> <span>${computedPrice}</span>
          </div>

          <button
            onClick={handleSwap}
            type="button"
            disabled={isDisabled}
            className={cn(styles.swapButton, disabled && "text-[#c5f0ea]")}
          >
            Swap {!isDisabled && "✨"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TokenSwap;

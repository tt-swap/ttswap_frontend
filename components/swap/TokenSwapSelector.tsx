import usePrices from "@/hooks/usePrices";
import useTokens from "@/hooks/useTokens";
import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { Price } from "@/shared/types/price";
import { Token } from "@/shared/types/token";
import { iconUrl } from "@/utils/icon";
import { useEffect, useMemo, useState } from "react";
import FlipMove from "react-flip-move";
// @ts-ignore
import Modal from "react-modal";
import TokenSwapModal from "./TokenSwapModal";
import ImgCache from "./components/common/ImgCache";
interface Props {
  value: string;
  onChange: (value: string) => void;
}
type LocalCurrency = Partial<Price & Token & { id: string }>;

const TokenSwapSelector = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const { prices } = usePrices();
  const { tokenMap } = useTokens();

  const availableTokens = useMemo<Array<LocalCurrency>>(() => {
    const result = prices.reduce((aggregate, el, id) => {
      if (el.currency.toUpperCase().includes(keyword.toUpperCase())) {
        aggregate.push({
          currency: el.currency,
          file: tokenMap[el.currency.toUpperCase()].file,
          price: el.price,
          id: el.currency + el.price + id,
        });
      }
      return aggregate;
    }, [] as Array<LocalCurrency>);
    console.log("result:", result);
    return result;
  }, [prices, keyword]);

  const isDefault = value === DEFAULT_TOKEN;

  useEffect(() => {
    Modal.setAppElement("body");
  }, []);
  return (
    <>
      <TokenSwapModal open={open} setOpen={setOpen}>
        <input
          autoFocus
          placeholder="Search name"
          className="bg-transparent mt-4 ml-4 border-none outline-none text-lg w-[350px] h-[40px] rounded-lg"
          type="text"
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
        />
        <FlipMove className="grid grid-cols-2">
          {availableTokens.map((el) => (
            <div
              onClick={() => onChange(el.currency || DEFAULT_TOKEN)}
              key={el.id}
              className="flex row cursor-pointer hover:bg-slate-600 justify-start gap-4 py-4 px-8 md:px-4"
              >
              <ImgCache alt="icon" className="w-6" src={iconUrl(el.file || "")} />
              <span className="text-lg block">{el.currency}</span>
            </div>
          ))}
        </FlipMove>
      </TokenSwapModal>
      <div
        className=" w-[150px] 
        rounded-xl
        cursor-pointer active:stroke-teal-100 flex items-center justify-center md:justify-start gap-2"
        onClick={() => setOpen(true)}
      >
        {!isDefault && (
          <ImgCache
            alt="icon"
            className="w-6"
            src={iconUrl(tokenMap[value.toUpperCase()].file)}
          />
        )}
        {value}
      </div>
    </>
  );
};

export default TokenSwapSelector;

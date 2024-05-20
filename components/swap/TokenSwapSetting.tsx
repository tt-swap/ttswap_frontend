import assets from "@/assets";
import { useState } from "react";
import TokenSwapModal from "./TokenSwapModal";

const TokenSwapSetting = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        onClick={() => {
          setOpen(true);
        }}
        className="cursor-pointer h-7"
        src={"/setting.svg"}
      />
      <TokenSwapModal open={open} setOpen={setOpen}>
        <div className="p-10">
          <div className=" flex justify-between gap-4">
            <p>
              When available, aggregates liquidity sources for better prices and
              gas free swaps.
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://google.com"
                className="components__StyledLink-sc-88ab9cb5-5 ekQQ"
              >
                <div className="text-[#8ae7be]">Learn more</div>
              </a>
            </p>
            <div className="flex items-center justify-center">
              <label className="relative inline-flex items-center me-5 cursor-pointer">
                <input type="checkbox" value="" className="w-11 h-6 sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 outline-none dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#8ae7be]"></div>
              </label>
            </div>
          </div>
        </div>
      </TokenSwapModal>
    </>
  );
};

export default TokenSwapSetting;

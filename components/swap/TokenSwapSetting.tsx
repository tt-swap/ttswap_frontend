import assets from "@/assets";
import { useState } from "react";
import TokenSwapModal from "./TokenSwapModal";
import "./swap.css";
import { Switch,Input } from 'antd';

interface Props {
  value: number;
  value1: boolean;
  onChange: (val: number,val1:boolean) => void;
}

const TokenSwapSetting = ({ value,value1, onChange }: Props)  => {
  const [open, setOpen] = useState(false);
  const [istotal, setIstotal] = useState(value1);
  const [tolerance, setTolerance] = useState(value);

  const isSwitch = (checked: boolean) => {
    // console.log(`switch to ${checked}`);
    setIstotal(checked);
    onChange(tolerance,checked);
  };
  const onInput = (val: number) => {
    // console.log(`switch to ${checked}`);
    setTolerance(val);
    onChange(val,istotal);
  };
  return (
    <>
      <div
          onClick={() => {
            setOpen(true);
          }}
          className="cursor-pointer flex justify-between text-xs setting-style">
        <span>{value}% tolerance</span>
        <img
          className=""
          src={"/setting.svg"}
        />
      </div>
      <TokenSwapModal open={open} setOpen={setOpen} title={""}>
        <div>
        </div>
        <div className="p-10">
        <Input suffix="%" value={value} onChange={(e:any) => onInput(e.target.value)}/>
          <div className=" flex justify-between gap-4 pt-5">
            <p>
              only whole confirm.
              {/* <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://google.com"
                className="components__StyledLink-sc-88ab9cb5-5 ekQQ"
              >
                <div className="text-[#8ae7be]">Learn more</div>
              </a> */}
            </p>
            <Switch value={value1} onChange={isSwitch} />
            {/* <div className="flex items-center justify-center">
              <label className="relative inline-flex items-center me-5 cursor-pointer">
                <input type="checkbox" value="" className="w-11 h-6 sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 outline-none dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#8ae7be]"></div>
              </label>
            </div> */}
          </div>
        </div>
      </TokenSwapModal>
    </>
  );
};

export default TokenSwapSetting;

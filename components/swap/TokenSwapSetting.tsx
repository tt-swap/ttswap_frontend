import assets from "@/assets";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import TokenSwapModal from "./TokenSwapModal";
import "./swap.css";
import { Switch, Input, InputNumber } from 'antd';

interface Props {
  value: number;
  value1: boolean;
  value2: boolean;
  onChange: (val: number, val1: boolean, val2: boolean) => void;
}

const TokenSwapSetting = ({ value, value1,value2, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [istotal, setIstotal] = useState(value1);
  const [maxApprove, setMaxApprove] = useState(value2);
  const [tolerance, setTolerance] = useState(value);
  const { t } = useTranslation();

  const isSwitch = (checked: boolean) => {
    // console.log(`switch to ${checked}`);
    setIstotal(checked);
    onChange(tolerance, checked,maxApprove);
  };
  const isMax = (checked: boolean) => {
    // console.log(`switch to ${checked}`);
    setMaxApprove(checked);
    onChange(tolerance, istotal,checked);
  };
  const onInput = (val: number) => {
    // console.log(`switch to ${checked}`);
    setTolerance(val);
    onChange(val, istotal,maxApprove);
  };
  return (
    <>
      <div
        onClick={() => {
          setOpen(true);
        }}
        className="cursor-pointer flex justify-between text-xs setting-style">
        <span>{value}% {t('body.swap.tolerance')}</span>
        <img
          className=""
          src={"/setting.svg"}
        />
      </div>
      <TokenSwapModal open={open} setOpen={setOpen} title={""}>
        <div>
        </div>
        <div className="p-10">
          <InputNumber
            max={5}
            suffix="%"
            value={value}
            onChange={(e: any) => onInput(e)}
            style={{width:"100%"}}
          />
          <div className=" flex justify-between gap-4 pt-5">
            <p>
            {t('body.swap.tolerance.all')}
            </p>
            <Switch value={value1} onChange={isSwitch} />
          </div>
          <div className=" flex justify-between gap-4 pt-5">
            <p>
            {t('body.swap.tolerance.maxApprove')}
            </p>
            <Switch value={value2} onChange={isMax} />
          </div>
        </div>
      </TokenSwapModal>
    </>
  );
};

export default TokenSwapSetting;

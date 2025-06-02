import assets from "@/assets";
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import TokenSwapModal from "./TokenSwapModal";
import "./swap.css";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Switch, Input, InputNumber, Col, Row, Slider, Space, Tooltip } from 'antd';
import type { InputNumberProps } from 'antd';

interface Props {
  value: number;
  value1: boolean;
  value2: boolean;
  onChange: (val: number, val1: boolean, val2: boolean) => void;
}

// const IntegerStep = ({ value, value1, value2, onChange }: Props) => {
//   const [inputValue, setInputValue] = useState(value);

//   const onChanges: InputNumberProps['onChange'] = (newValue) => {
//     setInputValue(newValue as number);
//     onChange(tolerance, checked, maxApprove);
//   };

//   return (
//     <Row>
//       <Col span={15}>
//         <Slider
//           min={1}
//           max={5}
//           onChange={onChanges}
//           value={typeof inputValue === 'number' ? inputValue : 0}
//         />
//       </Col>
//       <Col span={6}>
//         <InputNumber
//           min={1}
//           max={5}
//           style={{ margin: '0 0 0 16px' }}
//           value={inputValue}
//           onChange={onChanges}
//         />
//       </Col>
//     </Row>
//   );
// };

const TokenSwapSetting = ({ value, value1, value2, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [istotal, setIstotal] = useState(value1);
  const [maxApprove, setMaxApprove] = useState(value2);
  // const [tolerance, setTolerance] = useState(value);
  const [inputValue, setInputValue] = useState(value);
  const { t } = useTranslation();

  const isSwitch = (checked: boolean) => {
    // console.log(`switch to ${checked}`);
    setIstotal(checked);
    onChange(inputValue, checked, maxApprove);
  };
  const isMax = (checked: boolean) => {
    // console.log(`switch to ${checked}`);
    setMaxApprove(checked);
    onChange(inputValue, istotal, checked);
  };
  // const onInput = (val: number) => {
  //   // console.log(`switch to ${checked}`);
  //   setTolerance(val);
  //   onChange(val, istotal, maxApprove);
  // };

  const onChanges: InputNumberProps['onChange'] = (newValue) => {
    setInputValue(newValue as number);
    onChange(newValue as number, istotal, maxApprove);
  };

  return (
    <>
      <div
        onClick={() => {
          setOpen(true);
        }}
        className="cursor-pointer flex justify-between text-xs setting-style">
        <span>{value} {t('body.swap.tolerance.timelimits')}</span>
        <img
          className=""
          src={"/setting.svg"}
        />
      </div>
      <TokenSwapModal open={open} setOpen={setOpen} title={""}>
        <div>
        </div>
        <div className="p-10">
          {/* <InputNumber
            max={100}
            suffix="%"
            value={value}
            onChange={(e: any) => onInput(e)}
            style={{ width: "100%" }}
          /> */}
          {/* <Space style={{ width: '100%' }} direction="vertical">
            <IntegerStep />
          </Space> */}
          <div className=" flex justify-between gap-4 pt-5">
            <p>
              {t('body.swap.tolerance.timelimits')}{' '}
              <Tooltip title={t('body.swap.tolerance.timelimits.tip')}><QuestionCircleOutlined style={{color:"#999999"}} /></Tooltip>
            </p>
            {/* <Switch value={value1} onChange={isSwitch} /> */}
            <Space style={{ width: '70%' }} direction="vertical">
              <Row>
                <Col span={15}>
                  <Slider
                    min={1}
                    max={5}
                    onChange={onChanges}
                    value={typeof inputValue === 'number' ? inputValue : 0}
                  />
                </Col>
                <Col span={6}>
                  <InputNumber
                    min={1}
                    max={5}
                    style={{ margin: '0 0 0 16px' }}
                    value={inputValue}
                    onChange={onChanges}
                  />
                </Col>
              </Row>
            </Space>
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

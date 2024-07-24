import React, { CSSProperties, useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { Skeleton } from "antd";

import { getEllipsisTxt } from "utils/formatters";

import Jazzicons from "../Jazzicons";
import { useWalletAddress } from "@/stores/walletAddress";

const styles = {
  addressBox: {
    height: "36px",
    display: "flex",
    gap: "5px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    alignItems: "center",
    justifyContent: "space-around"
  },
  address: {
    display: "inline-flex",
    alignItems: "center",
    gap: "1rem"
  }
};

export interface AddressProps {
  style: CSSProperties | undefined;
  avatar: string;
  size: number | undefined;
  copyable: boolean;
}

const Address: React.FC<AddressProps> = (props) => {
  const { account } = useWeb3React();
  // const [address, setAddress] = useState<string>();
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const { address } = useWalletAddress();

  // useEffect(() => {
  //   // @ts-ignore
  //   setAddress(localStorage.getItem("wallet"));
  // }, [localStorage.getItem("wallet")]);

  useEffect(() => {
    if (isClicked === true)
      setTimeout(() => {
        setIsClicked(false);
      }, 5000);
  }, [isClicked]);

  if (address === undefined) return <Skeleton paragraph={{ rows: 1, width: "100%" }} title={false} active />;
  // console.log(navigator, 8888)
  function fallbackCopyTextToClipboard(text: string): void {
    const textarea = document.createElement('textarea');
    textarea.style.position = 'fixed'; // 防止滚动条
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.opacity = '0';
    textarea.value = text;
    document.body.appendChild(textarea);

    try {
        // 尝试复制文本
        textarea.select();
        document.execCommand('copy');
        // alert('文本已复制到剪贴板（回退方案）');
    } catch (err) {
        // console.error('复制文本时出错（回退方案）:', err);
        // alert('复制文本时出错，请尝试手动复制');
    }

    document.body.removeChild(textarea);
}


  const Copy = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#1780FF"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ cursor: "pointer" }}
      onClick={() => {
        if (navigator.clipboard) {
          // 使用 clipboard API 复制文本
          navigator.clipboard.writeText(address);
          // alert('文本已复制到剪贴板');
        } else {
          // 如果不支持，可以提供一个回退方案，比如使用 prompt 或者 textarea + document.execCommand('copy')（但请注意，execCommand 已被弃用）
          fallbackCopyTextToClipboard(address);
          // alert('浏览器不支持 clipboard API');
        }
        setIsClicked(true);
      }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 3v4a1 1 0 0 0 1 1h4" />
      <path d="M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2z" />
      <path d="M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
      <title id="copy-address">Copy Address</title>
    </svg>
  );

  return (
    <div style={{ ...styles.addressBox, ...props.style }}>
      <div style={styles.address}>
        {props.avatar === "left" && <Jazzicons seed={address} />}
        <p>{props.size ? getEllipsisTxt(address, props.size) : address}</p>
      </div>
      {props.avatar === "right" && <Jazzicons seed={address} />}
      {props.copyable && (isClicked ? <Check /> : <Copy />)}
    </div>
  );
};

export default Address;

const Check = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="3"
    stroke="#21BF96"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 12l5 5l10 -10" />
    <title id="copied-address">Copied!</title>
  </svg>
);

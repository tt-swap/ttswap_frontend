// import { useState } from "react";
import MessModal from "./Modal";
// import "./swap.css";
import { Result } from 'antd';

interface Props {
  status: string;
  title: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const Message = ({ status, title, open,setOpen }: Props) => {

  return (
    <>
      <MessModal open={open} title={""} setOpen={setOpen}>
        <Result
          // @ts-ignore
          status={status}
          title={title}
        />
      </MessModal>
    </>
  );
};

export default Message;

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
  // const [open, setOpen] = useState(false);
  // const [istotal, setIstotal] = useState(value1);
  // const [tolerance, setTolerance] = useState(value);

  return (
    <>
      <MessModal open={open} title={""} setOpen={setOpen}>
        <Result
          // @ts-ignore
          status={status}
          title={title}
        // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
        // extra={[
        //   <Button type="primary" key="console">
        //     Go Console
        //   </Button>,
        //   <Button key="buy">Buy Again</Button>,
        // ]}
        />
      </MessModal>
    </>
  );
};

export default Message;

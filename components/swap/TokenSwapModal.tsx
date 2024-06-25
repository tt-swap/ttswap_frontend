import assets from "@/assets";
import { PropsWithChildren } from "react";
// @ts-ignore
// import Modal from "react-modal";
import { isMobile } from 'react-device-detect';
import { Button, Modal,Select } from 'antd';

type Props = PropsWithChildren<{
  open: boolean;
  setOpen: (value: boolean) => void;
  title: string;
}>;
const TokenSwapModal = ({ open, setOpen, title, children }: Props) => {
  const handleClose = (a: boolean, b: string) => {
    setOpen(a);
    document.body.style.overflow = b;
  };
  return (
    <Modal
    title={title}
    open={open}
    onCancel={() => handleClose(false, "")}
    footer={null}
    width={480}
      // shouldReturnFocusAfterClose={false}
    >
      {/* <div className="relative w-full md:w-[450px]">
        <div
          style={{ padding: "20px 20px 16px 20px", fontWeight: "500" }}
          className="flex justify-between"
        >
          <div>{title}</div>
          <button
            type="button"
            onClick={() => handleClose(false, "")}
          >
            <img className="text-black" src={"/close_1.svg"} alt="close" />
          </button>
        </div>
        {children}
      </div> */}
        {children}
    </Modal>
  );
};

export default TokenSwapModal;

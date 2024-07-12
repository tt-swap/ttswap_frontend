import assets from "@/assets";
import { PropsWithChildren } from "react";
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
    >
        {children}
    </Modal>
  );
};

export default TokenSwapModal;

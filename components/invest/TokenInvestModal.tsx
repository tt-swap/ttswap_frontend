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
const TokenInvestModal = ({ open, setOpen, title, children }: Props) => {
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
    width={520}
      // shouldReturnFocusAfterClose={false}
    >
        {children}
    </Modal>
  );
};

export default TokenInvestModal;

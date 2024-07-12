import { PropsWithChildren } from "react";
import {  Modal } from 'antd';

type Props = PropsWithChildren<{
  open: boolean;
  setOpen: (value: boolean) => void;
  title: string;
}>;
const CreatModal = ({ open, setOpen, title, children }: Props) => {
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
    width={460}
    destroyOnClose={true}
    >
        {children}
    </Modal>
  );
};

export default CreatModal;

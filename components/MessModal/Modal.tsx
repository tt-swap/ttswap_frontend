import { PropsWithChildren,useState,useMemo } from "react";
// import { isMobile } from 'react-device-detect';
import {  Modal } from 'antd';

type Props = PropsWithChildren<{
  open: boolean;
  setOpen: (value: boolean) => void;
  title: string;
}>;
const MessModal = ({ open, title,setOpen, children }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  useMemo(() => {
    // @ts-ignore
    setIsModalOpen(open);
}, [open]);
  const handleClose = (a: boolean, b: string) => {
    setIsModalOpen(a);
    setOpen(a);
    document.body.style.overflow = b;
  };
  return (
    <Modal
    title={title}
    open={isModalOpen}
    onCancel={() => handleClose(false, "")}
    footer={null}
    width={480}
    >
        {children}
    </Modal>
  );
};

export default MessModal;

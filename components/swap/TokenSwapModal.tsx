import assets from "@/assets";
import { PropsWithChildren } from "react";
// @ts-ignore
import Modal from "react-modal";
import { isMobile } from 'react-device-detect';

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
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          zIndex: 9999,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",

        },
        content: {
          height: isMobile ? "80%" : "450px",
          position: "unset",
          background: "#fff",
          outline: "none",
          padding: 0,
          border: "none",
          overflowX: "hidden",
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
          width: "50vw",
          overflow: "hidden auto",
          maxWidth: "420px",
          maxHeight: "660px",
          minHeight: "300px",
          borderRadius: "20px",
          margin: "auto",
          fontFamily: "Basel, sans-serif",
        },
      }}
      isOpen={open}
      onRequestClose={() => handleClose(false, "")}
      shouldReturnFocusAfterClose={false}
    >
      <div className="relative w-full md:w-[450px]">
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
      </div>
    </Modal>
  );
};

export default TokenSwapModal;

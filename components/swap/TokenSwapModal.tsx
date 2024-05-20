import assets from "@/assets";
import { PropsWithChildren } from "react";
// @ts-ignore
import Modal from "react-modal";
import { isMobile } from 'react-device-detect';

type Props = PropsWithChildren<{
  open: boolean;
  setOpen: (value: boolean) => void;
}>;
const TokenSwapModal = ({ open, setOpen, children }: Props) => {
  return (
    <Modal
      style={{
        overlay: {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          display: "flex",
          zIndex: 10,
          justifyContent: "center",
          alignItems: "center",
        },
        content: {
          height: isMobile ? "80%": "450px",
          position: "unset",
          background: "transparent",
          outline: "none",
          padding: 0,
          border: "none",
          overflowX: "hidden",
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
        },
      }}
      isOpen={open}
      onRequestClose={() => setOpen(false)}
      shouldReturnFocusAfterClose={false}
    >
      <div className="relative w-full md:w-[450px]">
        <button
          className={"text-black z-50 cursor-pointer absolute top-4 right-4"}
          type="button"
          onClick={() => setOpen(false)}
        >
          {/* <img className="text-black" src={assets.close} alt="close" /> */}
          <img className="text-black" src={"/close.svg"} alt="close" />
        </button>
        {children}
      </div>
    </Modal>
  );
};

export default TokenSwapModal;

import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';

import { Modal, Divider, message } from "antd";

import coinbase_Logo from "assets/images/coinbase_Logo.png";
import metamask_Logo from "assets/svg/metamask_Logo.svg";
import walletconnect_Logo from "assets/svg/walletconnect_Logo.svg";
import { hooks as coinbaseWallethooks, coinbaseWallet } from "connectors/coinbaseWallet";
import { getName } from "connectors/getConnectorName";
import { hooks as metaMaskhooks, metaMask } from "connectors/metaMask";
import { hooks as walletConnecthooks, walletConnect } from "connectors/walletConnect";
import { useWeb3React } from "@web3-react/core";
import "./index.css";

import ConnectButton from "./ConnectButton";

const styles = {
  modalTitle: {
    marginBottom: "20px",
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "20px"
  }
} as const;

interface ConnectModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const { useIsActivating: useMMIsActivating } = metaMaskhooks;
const { useIsActivating: useWCIsActivating } = walletConnecthooks;
const { useIsActivating: useCBIsActivating } = coinbaseWallethooks;

const ConnectModal: React.FC<ConnectModalProps> = ({ isModalOpen, setIsModalOpen }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const isMMActivating = useMMIsActivating();
  const isWCActivating = useWCIsActivating();
  const isCBActivating = useCBIsActivating();
  const connectOpenRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const activateConnector = useCallback(async (label: string) => {
    try {
      switch (label) {
        case "MetaMask":
          await metaMask.activate();
          window.window.localStorage.setItem("connectorId", getName(metaMask));
          break;

        case "WalletConnect":
          // console.log(await walletConnect.activate(11155111), "11110000999");
          await walletConnect.activate();
          window.window.localStorage.setItem("connectorId", getName(walletConnect));
          break;

        case "Coinbase Wallet":
          await coinbaseWallet.activate();
          window.window.localStorage.setItem("connectorId", getName(coinbaseWallet));
          break;

        default:
          break;
      }
      setIsModalOpen(false);
    } catch (error) {
      messageApi.error(t('header.menu.account.error'));
    }
  }, []);

  // console.log("metamask_Logo:", metamask_Logo);

  const handleClickOutside = (event: MouseEvent) => {
    if (connectOpenRef.current && !connectOpenRef.current.contains(event.target as Node)) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  return (
    <>
      {contextHolder}
      {isModalOpen && (
        <div className="account-sign" ref={connectOpenRef}>
          <div
            className="account-drawer"
          >
            <div style={styles.modalTitle}>{t('header.menu.account.connect.title')}</div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <ConnectButton
                label="MetaMask"
                image="/metamask_Logo.svg"
                onClick={() => activateConnector("MetaMask")}
                loading={isMMActivating}
              />

              <ConnectButton
                label="WalletConnect"
                image={walletconnect_Logo.src}
                onClick={() => activateConnector("WalletConnect")}
                loading={isWCActivating}
              />

              <ConnectButton
                label="Coinbase Wallet"
                image={coinbase_Logo.src}
                onClick={() => activateConnector("Coinbase Wallet")}
                loading={isCBActivating}
              />
              <Divider />
              <div style={{ margin: "auto", fontSize: "15px", marginBottom: "15px" }}>
                {t('header.menu.account.connect.tip')}{" "}
                <a
                  style={{ color: "red" }}
                  href="https://metamask.io/"
                  target="_blank"
                  rel="noopener"
                >
                  {t('header.menu.account.connect.tipclick')}
                </a>
              </div>

              <div style={{ margin: "auto", fontSize: "10px" }}>
                {t('header.menu.account.connect.detail')}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectModal;

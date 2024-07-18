import React, { useCallback, useState, useMemo } from "react";

import { useWeb3React } from "@web3-react/core";
import { Button } from "antd";

import { metaMask } from "connectors/metaMask";
import { walletConnect } from "connectors/walletConnect";
import { useWindowSize } from "hooks";
import { getEllipsisTxt } from "utils/formatters";

import ConnectModal from "./ConnectModal";
import DisconnectModal from "./DisconnectModal";
import Jazzicons from "../Jazzicons";
import {useWalletAddress} from "@/stores/walletAddress";

const styles = {
  account: {
    height: "42px",
    borderRadius: "10px",
    display: "inline-flex",
    alignItems: "center",
    border: " 1px solid rgba(152, 161, 192, 0.24)"
  },
  button: {
    height: "40px",
    padding: "0 20px",
    textAlign: "center",
    fontWeight: "600",
    letterSpacing: "0.2px",
    fontSize: "15px",
    margin: "20px 20px",
    border: "none"
  },
  modalTitle: {
    marginBottom: "20px",
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "20px"
  }
} as const;

interface WantedChain {
  chain?: number;
}

const ConnectAccount: React.FC<WantedChain> = () => {
  const { account,chainId } = useWeb3React();
  const { isTablet } = useWindowSize();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const { address,setAccount } = useWalletAddress();

  const disconnect = useCallback(async () => {
    const connector = metaMask || walletConnect;
    setIsModalVisible(false);
    setIsAuthModalOpen(false);
    window.localStorage.removeItem("connectorId");
    if (connector.deactivate) {
      connector.deactivate();
    } else {
      connector.resetState();
    }
    // @ts-expect-error close can be returned by wallet
    if (connector && connector.close) {
      // @ts-expect-error close can be returned by wallet
      await connector.close();
    }
    window.localStorage.removeItem("wallet");
    window.localStorage.removeItem("chainId");
    setAccount(null);
  }, []);

  useMemo(() => {
    if (account !== undefined) {
      window.localStorage.setItem("wallet", account);
      setAccount(account);
      // @ts-ignore
      // window.localStorage.setItem("chainId", chainId);
    } else {
      // setAccount(window.localStorage.getItem("wallet"));
    }
  }, [account, address,chainId]);
  // console.log(account, 999)
  return (
    <>
    {/* {console.log(address,7779999)} */}
      {address === "undefined" || address === null ? (
        <div>
          <Button shape="round" type="primary" style={styles.button} onClick={() => setIsAuthModalOpen(true)}>
            Connect Wallet
          </Button>
          <ConnectModal isModalOpen={isAuthModalOpen} setIsModalOpen={setIsAuthModalOpen} />
          <br />
        </div>
      ) : (
        <>
          <Button style={styles.account} onClick={() => setIsModalVisible(true)}>
            {address && typeof address === "string" && (
        // @ts-ignore
              <p style={{ marginRight: "5px" }}>{getEllipsisTxt(address, isTablet ? 3 : 6)}</p>
            )}
            <Jazzicons seed={address} />
          </Button>

          <DisconnectModal isModalOpen={isModalVisible} setIsModalOpen={setIsModalVisible} disconnect={disconnect} />
        </>
      )}
    </>
  );
};

export default ConnectAccount;

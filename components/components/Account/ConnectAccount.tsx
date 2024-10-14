import React, { useCallback, useState, useMemo,useEffect } from "react";
import { useTranslation } from 'react-i18next';

import { useWeb3React } from "@web3-react/core";
import { Button } from "antd";
import { DoubleRightOutlined } from '@ant-design/icons';

import { metaMask } from "connectors/metaMask";
import { walletConnect } from "connectors/walletConnect";
import { useWindowSize } from "hooks";
import { getEllipsisTxt } from "utils/formatters";

import ConnectModal from "./ConnectModal";
import DisconnectModal from "./DisconnectModal";
import Jazzicons from "../Jazzicons";
import { useWalletAddress } from "@/stores/walletAddress";
import ChainSelector from "@/components/ChainSelector";
import { LanguageSwitcher } from "@/components/Language/LanguageSwitcher"

const styles = {
    account: {
        height: "42px",
        // borderRadius: "10px",
        display: "inline-flex",
        alignItems: "center",
        // border: " 1px solid rgba(152, 161, 192, 0.24)"
    },
    button: {
        height: "40px",
        padding: "0 20px",
        textAlign: "center",
        fontWeight: "600",
        letterSpacing: "0.2px",
        fontSize: "15px",
        // margin: "20px 20px",
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
    const { account, chainId } = useWeb3React();
    const { isTablet } = useWindowSize();
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
    const { address, setAccount } = useWalletAddress();
    const { t } = useTranslation();

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

    useEffect(() => {
        if (account !== undefined) {
          window.localStorage.setItem("wallet", account);
          setAccount(account);
        }
      }, [account, chainId]);
    // console.log(account, 999)
    return (
        <>
            {/* {console.log(address,7779999)} */}
            {address === "undefined" || address === null ? (
                <div>
                    <Button shape="round" type="primary" style={styles.button} onClick={() => setIsAuthModalOpen(true)}>
                        {t('header.menu.account.connect')}
                    </Button>
                    <ConnectModal isModalOpen={isAuthModalOpen} setIsModalOpen={setIsAuthModalOpen} />
                    <br />
                </div>
            ) : (
                <>
                    <div className="wallet">
                        <Button shape="round" type="primary" style={styles.account} onClick={() => setIsModalVisible(true)}>
                            <Jazzicons seed={address} />
                            {address && typeof address === "string" && (
                                // @ts-ignore
                                <p>{getEllipsisTxt(address, isTablet ? 3 : 4)}</p>
                            )}
                        </Button>
                        {isModalVisible && (
                            <div className="expanded-area">
                                <div className="close-area" onClick={() => setIsModalVisible(false)}>
                                    <DoubleRightOutlined />
                                </div>
                                <div className="content-area">
                                    <div className="content-area-cont">
                                        <DisconnectModal disconnect={disconnect} />
                                        <div>
                                            <div className="flex justify-between items-center pt-4 pb-4">
                                                <div>Language</div>
                                                <LanguageSwitcher />
                                            </div>
                                            <div className="flex justify-between items-center pt-4 pb-4">
                                                <div>Networks</div>
                                                <ChainSelector />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </>
            )}
        </>
    );
};

export default ConnectAccount;

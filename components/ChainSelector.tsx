import { FC, useEffect, useMemo, useState } from "react";

import { DownOutlined } from "@ant-design/icons";
import { useWeb3React } from "@web3-react/core";
import { Dropdown, Button } from "antd";
import type { MenuProps } from "antd";

import arbitrum_Logo from "assets/images/arbitrum_Logo.png";
import ethereum_Logo from "assets/images/ethereum_Logo.png";
import fantom_Logo from "assets/images/fantom_Logo.png";
import polygon_logo from "assets/images/polygon_logo.png";
import zksync_Logo from "assets/images/zksync_Logo.png";
import bsc_Logo from "assets/svg/bsc_Logo.svg";
import optimistim_Logo from "assets/svg/optimistim_Logo.svg";
import { chainIds } from "data/chainIds";
import { useSwitchChain, useWindowSize } from "hooks";
import { StaticImageData } from "next/image";

const styles = {
  item: {
    fontWeight: "500",
    fontFamily: "Roboto, sans-serif",
    fontSize: "14px"
  },
  button: {
    display: "flex",
    alignItems: "center",
    height: "42px",
    border: "0",
    borderRadius: "10px"
  }
};

type MenuItem = Required<MenuProps>["items"][number];

const ChainSelector: FC = () => {
  const switchChain = useSwitchChain();
  const { chainId, isActive } = useWeb3React();
  const { isTablet } = useWindowSize();
  const [chainId1, setChainId] = useState(1);
  const [selected, setSelected] = useState<MenuItem>();
  const [label, setLabel] = useState<JSX.Element>();
  const labelToShow = (logo: StaticImageData, alt: string) => {
    return (
      <div style={{ display: "inline-flex", alignItems: "center" }}>
        <img src={logo.src} alt={alt} style={{ width: "25px", height: "25px", borderRadius: "10px", marginRight: "0" }} />
      </div>
    );
  };

  const items: MenuProps["items"] = useMemo(
    () => [
      { label: "Ethereum", key: chainIds.ethereum, icon: labelToShow(ethereum_Logo, "Ethereum_logo") },
      { label: "Sepolia Testnet", key: chainIds.sepolia, icon: labelToShow(ethereum_Logo, "Ethereum_logo") },
      { label: "Optimism", key: chainIds.optimism, icon: labelToShow(optimistim_Logo, "Optimistim_Logo") },
      { label: "Optimism Goerli", key: chainIds.optimismtest, icon: labelToShow(optimistim_Logo, "Optimistim_Logo") },
      { label: "Arbitrum", key: chainIds.arbitrum, icon: labelToShow(arbitrum_Logo, "Arbitrum_Logo") },
      { label: "Arbitrum testnet", key: chainIds.arbitrumtest, icon: labelToShow(arbitrum_Logo, "Arbitrum_Logo") },
      { label: "zkSync Era", key: chainIds.zkSync, icon: labelToShow(zksync_Logo, "zksync_Logo") },
      { label: "zkSync testnet", key: chainIds.zksynctest, icon: labelToShow(zksync_Logo, "zksync_Logo") },
      { label: "Polygon", key: chainIds.polygon, icon: labelToShow(polygon_logo, "Polygon_logo") },
      { label: "Mumbai", key: chainIds.mumbai, icon: labelToShow(polygon_logo, "Polygon_logo") },
      { label: "Fantom", key: chainIds.fantom, icon: labelToShow(fantom_Logo, "Fantom_Logo") },
      { label: "Fantom testnet", key: chainIds.fantomtest, icon: labelToShow(fantom_Logo, "Fantom_Logo") },
      { label: "BNB Chain", key: chainIds.bsc, icon: labelToShow(bsc_Logo, "BNB_logo") },
      { label: "BNB Testnet", key: chainIds.bsctest, icon: labelToShow(bsc_Logo, "BNB_logo") }
    ],
    []
  );
  
  // useEffect(() => {setChainId(1);});
  useEffect(() => {
    if (chainId) setChainId(chainId);
    
// if (!chainId1) return;
    let selectedLabel;
    if (chainId1 === 1 || chainId1 === 11155111) {
      selectedLabel = labelToShow(ethereum_Logo, "Ethereum_logo");
    } else if (chainId1 === 137 || chainId1 === 80001) {
      selectedLabel = labelToShow(polygon_logo, "Polygon_logo");
    } else if (chainId1 === 10 || chainId1 === 420) {
      selectedLabel = labelToShow(optimistim_Logo, "Optimistim_Logo");
    } else if (chainId1 === 280 || chainId1 === 324) {
      selectedLabel = labelToShow(zksync_Logo, "zksync_Logo");
    } else if (chainId1 === 250 || chainId1 === 4002) {
      selectedLabel = labelToShow(fantom_Logo, "Fantom_Logo");
    } else if (chainId1 === 42161 || chainId1 === 421614) {
      selectedLabel = labelToShow(arbitrum_Logo, "Arbitrum_Logo");
    } else {
      selectedLabel = undefined;
    }

    setLabel(selectedLabel);
    setSelected(items.find((item) => item?.key === chainId1.toString()));
  }, [chainId1,chainId]);

  const onClick: MenuProps["onClick"] = async ({ key }) => {
    if (!isActive) {
      // @ts-ignore
      setChainId(key*1);
    } else {
      // setChainId(key*1);
      await switchChain(Number(key)).catch((error) => {
        console.error(`"Failed to switch chains: " ${error}`);
      });
    }
    console.log(chainId1,key,999)
  };

  // if (!chainId || !isActive) return null;

  return (
    <div>
      <Dropdown menu={{ items, onClick }}>
        <Button style={{ ...styles.button, ...styles.item }}>
          {!selected && <span style={{ marginLeft: "5px" }}>Select Chain</span>}
          {selected ? (
            <div style={{ display: "flex", alignItems: "center", minWidth: "25px" }}>
              <span style={{ paddingTop: "5px" }}>{label}</span>
            </div>
          ) : (
            <>
              {label && (
                <div style={{ display: "flex", alignItems: "center", minWidth: "100px" }}>
                  <span style={{ paddingTop: "5px" }}>{label}</span>
                  {/*  @ts-expect-error title is a valid object */}
                  <span style={{ marginRight: "10px" }}>{selected?.label}</span>
                </div>
              )}
            </>
          )}
          <DownOutlined />
        </Button>
      </Dropdown>
    </div>
  );
};

export default ChainSelector;

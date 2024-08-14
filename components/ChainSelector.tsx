import { FC, useEffect, useMemo, useState, useContext } from "react";

import { DownOutlined } from "@ant-design/icons";
import { useWeb3React } from "@web3-react/core";
import { Dropdown, Button } from "antd";
import type { MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";

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
import { useLocalStorage } from "@/utils/LocalStorageManager";
import { getAddChainParameters } from "data/networks";

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

  const router = useRouter();
  const pathname = usePathname()
  const switchChain = useSwitchChain();
  const { chainId, isActive, account } = useWeb3React();
  const { isTablet } = useWindowSize();
  const [chainId1, setChainId] = useState(97);
  const [selected, setSelected] = useState<MenuItem>();
  const [label, setLabel] = useState<JSX.Element>();
  // @ts-ignore
  const { ssionChian,setSsionChian } = useLocalStorage();

  const routeSegments = pathname.split('/');

  const labelToShow = (logo: StaticImageData, alt: string) => {
    return (
      <div style={{ display: "inline-flex", alignItems: "center" }}>
        <img src={logo.src} alt={alt} style={{ width: "25px", height: "25px", borderRadius: "10px", marginRight: "0" }} />
      </div>
    );
  };

  const routerUp = () => {

    // @ts-ignore
    const chainName = getAddChainParameters(chainId1).chainName;
    routeSegments[1] = chainName;
    const newRoute = routeSegments.join('/');
    console.log(routeSegments, chainName, newRoute);
    router.push(newRoute)
  };


  const items: MenuProps["items"] = useMemo(
    () => [
      // { label: "Ethereum", key: chainIds.ethereum, icon: labelToShow(ethereum_Logo, "Ethereum_logo") },
      { label: "Sepolia Testnet", key: chainIds.sepolia, icon: labelToShow(ethereum_Logo, "Ethereum_logo") },
      // { label: "Optimism", key: chainIds.optimism, icon: labelToShow(optimistim_Logo, "Optimistim_Logo") },
      // { label: "Optimism Goerli", key: chainIds.optimismgoerli, icon: labelToShow(optimistim_Logo, "Optimistim_Logo") },
      // { label: "Arbitrum", key: chainIds.arbitrum, icon: labelToShow(arbitrum_Logo, "Arbitrum_Logo") },
      // { label: "Arbitrum testnet", key: chainIds.arbitrumsepolia, icon: labelToShow(arbitrum_Logo, "Arbitrum_Logo") },
      // { label: "zkSync Era", key: chainIds.zkSync, icon: labelToShow(zksync_Logo, "zksync_Logo") },
      // { label: "zkSync testnet", key: chainIds.zksyncgoerli, icon: labelToShow(zksync_Logo, "zksync_Logo") },
      // { label: "Polygon", key: chainIds.polygon, icon: labelToShow(polygon_logo, "Polygon_logo") },
      // { label: "Mumbai", key: chainIds.polygonmumbai, icon: labelToShow(polygon_logo, "Polygon_logo") },
      // { label: "Fantom", key: chainIds.fantom, icon: labelToShow(fantom_Logo, "Fantom_Logo") },
      // { label: "Fantom testnet", key: chainIds.fantomtest, icon: labelToShow(fantom_Logo, "Fantom_Logo") },
      // { label: "BNB Chain", key: chainIds.binance, icon: labelToShow(bsc_Logo, "BNB_logo") },
      { label: "BSC Testnet", key: chainIds.binancetestnet, icon: labelToShow(bsc_Logo, "BNB_logo") }
    ],
    []
  );

  useEffect(() => {
    const chname = routeSegments[1];
    // (async () => {
      const chid = chainIds[chname];
      setChainId(ssionChian);
      console.log(Number(chid), "account");
    // })();
  }, []);

  useEffect(() => {
    // const cid = routeSegments[1];
    // setChainId(chainIds[cid]);
    console.log(chainId1, "accounsfdsdfsdt");
    if (chainId) {
      swithC(chainId1);
      // setChainId(chainId);
    }

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
    } else if (chainId1 === 56 || chainId1 === 97) {
      selectedLabel = labelToShow(bsc_Logo, "BNB_logo");
    } else {
      selectedLabel = undefined;
    }

    setLabel(selectedLabel);
    setSelected(items.find((item) => item?.key === chainId1.toString()));
    sessionStorage.setItem("chainId", chainId1.toString());
    setSsionChian(chainId1);
    routerUp();

  }, [chainId1, chainId, account]);

  const onClick: MenuProps["onClick"] = async ({ key }) => {
    // if (!isActive) {
    // @ts-ignore
    setChainId(key * 1);
    sessionStorage.setItem("chainId", key);
    setSsionChian(key);
    // } else {
    // setChainId(key*1);
    await switchChain(Number(key)).catch((error) => {
      console.error(`"Failed to switch chains: " ${error}`);
    });
    // }
    console.log(chainId1, key, 999)
  };

  async function swithC(key: any) {

    await switchChain(Number(key)).catch((error) => {
      console.error(`"Failed to switch chains: " ${error}`);
    });
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

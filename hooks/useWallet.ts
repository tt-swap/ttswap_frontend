import { useMemo } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { Balance } from "@/shared/types/balance";
import useSwap from "@/hooks/useSwap";
import erc20 from '@/data/abi/GenericERC20.json';

const useWallet = () => {

  const { ethereum } = window;
  const provider = new ethers.BrowserProvider(ethereum);
  const { isActive, account } = useWeb3React();
  const { swaps } = useSwap();

  const balanceSel = async (address:string) => {
    if(account !== undefined)
    try {
      if (address === "0") {
        const senderBalanceBefore = await provider.getBalance(account); //账户1余额
        return ethers.formatEther(senderBalanceBefore);
      } else {
        const contract = new ethers.Contract(address, erc20, provider);
        let decimals = await contract.decimals();
        const balance = await contract.balanceOf(account);
        return ethers.formatUnits(balance, decimals);
      }
    } catch (e) {
      return 0;
    }
  };

  const balanceMap = useMemo(async () => {
    if (isActive && account !== undefined) {
      const from = await balanceSel(swaps.from.address);
      const to = await balanceSel(swaps.to.address);
      console.log("balanceMap",from,to)
      return {from:from,to:to}
    }
  }, [swaps,isActive]);

  return { tokens: ["from", "to"], balanceMap };
};

export default useWallet;

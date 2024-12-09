import { ethers } from "ethers";
import erc20 from '@/data/abi/erc20.json';
import { useEthersSigner, useEthersProvider } from '@/connectors/wagmiEthersV6';
import { useLocalStorage } from "@/utils/LocalStorageManager";

const useFaucet = () => {

    // @ts-ignore
    const { ssionChian } = useLocalStorage();
    const provider = useEthersProvider(ssionChian);
    const signer = useEthersSigner(ssionChian);

    const faucetTestCion = async (amount: any, contractA: string, account: any) => {

        try {
            // const message = "获取测试币!";
            // const signature = await signer?.signMessage(message);
            // // 提取 v, r, s
            // const { r, s, v } = ethers.Signature.from(signature);

            // console.log("Signature:", signature);
            // console.log("r:", r);
            // console.log("s:", s);
            // console.log("v:", v);
            const contract = new ethers.Contract(contractA, erc20, signer);

            return await contract.mint(account, amount).then((transaction) => {
                console.log('Transaction sent:', transaction);
                return true;
            }).catch((error: any) => {
                console.error('error:', error);
                return false;
            });
        } catch (e) {
            return false;

        }
    }

    return {
        faucetTestCion
    };
};

export default useFaucet;

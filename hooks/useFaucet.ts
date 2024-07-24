import { ethers } from "ethers";
import erc20 from '@/data/abi/erc20.json';

const useFaucet = () => {
    // if (typeof window !== 'undefined') {
    // 浏览器环境特有的代码
    // const provider = new ethers.JsonRpcProvider('http://142.171.157.66:8545');

    const faucetTestCion = async (amount: any, contractA: string,account:string) => {

        try {
            const { ethereum } = window;
            // }
            const provider = new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(contractA, erc20, signer);

            return await contract.mint(account,amount).then((transaction) => {
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

import { ethers } from "ethers";
import erc20 from '@/data/abi/erc20.json';
import { useEthersSigner, useEthersProvider } from '@/config/wagmiEthersV6';
import { useLocalStorage } from "@/utils/LocalStorageManager";

const useFaucet = () => {

    // @ts-ignore
    const { ssionChian } = useLocalStorage();
    const provider = useEthersProvider({ chainId: ssionChian });
    const signer = useEthersSigner({ chainId: ssionChian });

    const faucetTestCion = async (amount: any, contractA: string, account: any, decimals: number) => {
        try {
            // const num = Number(amount) * 10 ** decimals;
            const mintAmount = amount;//ethers.parseUnits(amount, decimals);

            console.log("Mint parameters:",ssionChian, {
                contractAddress: contractA,
                recipient: account,
                amount: amount,
                parsedAmount: mintAmount,
                decimals: decimals
            });

            const contract = new ethers.Contract(contractA, erc20, signer);

            // 先检查合约是否有mint方法
            const contractInterface = new ethers.Interface(erc20);
            console.log("Contract interface:", contractInterface,contractInterface.hasFunction("mint"));
            if (!contractInterface.hasFunction("mint")) {
                console.error("Contract does not have mint function");
                return { success: false, error: "Contract does not have mint function" };
            }

            // 估算 gas
            try {
                const estimatedGas = await contract.mint.estimateGas(account, mintAmount);
                console.log("Estimated gas:", estimatedGas.toString());
            } catch (gasError) {
                console.warn("Could not estimate gas:", gasError);
            }

            // 发送交易
            const transactionResponse = await contract.mint(account, mintAmount);
            console.log('Transaction sent:', transactionResponse);

            // 等待交易确认
            const receipt = await transactionResponse.wait();
            console.log('Transaction confirmed:', receipt);

            return { success: true, transactionHash: receipt?.hash };
        } catch (error: any) {
            console.error('Faucet error details:', {
                message: error.message,
                code: error.code,
                reason: error.reason,
                transaction: error.transaction,
                error: error
            });

            // 处理不同的错误类型
            if (error.code === 'ACTION_REJECTED') {
                return {
                    success: false,
                    error: "用户拒绝了交易签名",
                    code: error.code
                };
            } else if (error.code === -32603) {
                return {
                    success: false,
                    error: "网络请求错误，请检查网络连接后重试",
                    code: error.code
                };
            } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
                return {
                    success: false,
                    error: "Gas估算失败，可能是参数错误或合约异常",
                    code: error.code
                };
            } else {
                return {
                    success: false,
                    error: "获取测试币失败",
                    code: error.code
                };
            }

        }
    };

    return {
        faucetTestCion
    };
};

export default useFaucet;
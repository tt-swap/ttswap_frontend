import { useMemo, useState, useEffect, useCallback } from "react";
import { ethers, AbiCoder } from "ethers";
import useSwap from "@/hooks/useSwap";
import useInvest from "@/hooks/useInvest";
import erc20 from '@/data/abi/erc20.json';
import Permit2 from '@/data/abi/Permit2.json';
import TTSwapMarket from '@/data/abi/MarketManager.json';
import { useSwapAmountStore } from "@/stores/swapAmount";
import { powerIterative } from '@/graphql/util';
import { useLocalStorage } from "@/utils/LocalStorageManager";
import { portal } from "@/config/PortalAddress";

import { getContractAddress, getPermit2PAddress, getSWETH } from '@/data/contractConfig';
import { useEthersSigner, useEthersProvider } from '@/connectors/wagmiEthersV6';

import { useAccount, useReadContracts, useReadContract, useBalance, useWriteContract, useSimulateContract, useEstimateGas } from 'wagmi';
import { erc20Abi } from "viem";

interface BalanceResult {
    amount: any;
    decimals: any;
}
const useWallet = () => {

    const signAddress = ""; //x402
    const signData = "0x";  //x402
    const defaultData = "0x";
    const MarketManager = TTSwapMarket;
    const ConAddress0 = "0x0000000000000000000000000000000000000000";
    const ConAddress1 = "0x0000000000000000000000000000000000000001";
    const ConAddress2 = "0x0000000000000000000000000000000000000002";
    const ConAddress3 = "0x0000000000000000000000000000000000000003";
    const defaultAmount = BigInt(2 ** 127);//ethers.MaxUint256;//
    // @ts-ignore
    const { ssionChian } = useLocalStorage();
    const { isConnected, address } = useAccount();
    const provider = useEthersProvider(ssionChian);
    const signer = useEthersSigner(ssionChian);
    const abiCoder = new AbiCoder();

    const contractAddress = getContractAddress(ssionChian);
    const permit2Address = getPermit2PAddress(ssionChian);
    const SWETH = getSWETH(ssionChian);
    // const gater = portal; // gater address

    const { swaps } = useSwap();
    const { invest } = useInvest();
    const { swapsAmount } = useSwapAmountStore();
    const [networkCost, setNetworkCost] = useState<string | number>(0);
    const [balanceMap, setbalanceMap] = useState({});
    const [balanceMap1, setbalanceMap1] = useState({});
    const [account, setAccount] = useState<string>();
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (!isConnected) {
            setIsActive(false);
        } else {
            setIsActive(true);
            setAccount(address);
        }
        // (async () => {
        // console.log(await provider?.getBalance(address), "balanceSel") })();
    }, [isConnected, address]);

    async function checkContractSupport(contractToken: string | ethers.Addressable, amount: any) {
        if (contractToken === ConAddress1 || contractToken === ConAddress2) {
            return 1;
        }
        if (contractToken === ConAddress3) {
            contractToken = SWETH;
        }
        const tokenContract = new ethers.Contract(contractToken, erc20, signer);
        const tokenContractp = new ethers.Contract(contractToken, erc20, provider);
        const tokenSymbol = await tokenContractp.symbol();
        if (contractToken === ConAddress1 || contractToken === ConAddress2 || tokenSymbol === "DAI" || tokenSymbol === "dai") return 1;
        try {
            // const tx = await tokenContract.approve(permit2Address,amount);
            // await tx.wait();
            const allowance = await tokenContractp.allowance(account, permit2Address).then((allowance) => {
                console.log("该代币支持 permit2Address:", allowance, amount);
                if (allowance > amount || allowance === amount) {
                    return true;
                } else {
                    return false;
                }
            }).catch((error) => {
                return false;
            });
            if (allowance) {
                return 5;
            }
        } catch (error) {
            console.error("检查授权时出错:", error);
        }
        // if (type === 'permit') {
        try {
            const nonce = await tokenContract.nonces(account);
            const allowance = await tokenContractp.allowance(account, contractAddress).then((allowance) => {
                console.log("该代币支持 allowance:", allowance, amount);
                if (allowance > amount || allowance === amount) {
                    return true;
                } else {
                    return false;
                }
            }).catch((error) => {
                return true;
            });
            if (!allowance) {
                console.log("该代币支持 Permit，nonce:", nonce.toString());
                return 2;
            }
            return 1;
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log("该代币不支持 Permit:", error.message);
            } else {
                console.log("该代币不支持 Permit: 未知错误");
            }
            return 1;
        }
    }

    //使用 Permit 授权 签名消息
    async function PermitSigner(contract: string, value: any, symbol: string) {
        // 代币合约实例
        const tokenContract = new ethers.Contract(contract, erc20, signer);
        const tokenContractp = new ethers.Contract(contract, erc20, provider);
        // 授权参数
        const spender = contractAddress;
        const name = await tokenContractp.name();
        const nonce = await tokenContract.nonces(account);
        const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10分钟后过期
        // 生成签名
        const domain = {
            name: name,
            version: "1",
            chainId: ssionChian, // 主网
            verifyingContract: contract,
        };
        const types = {
            Permit: [
                { name: "owner", type: "address" },
                { name: "spender", type: "address" },
                { name: "value", type: "uint256" },
                { name: "nonce", type: "uint256" },
                { name: "deadline", type: "uint256" },
            ],
        };
        const message = {
            owner: account,
            spender: spender,
            value: value,
            nonce: nonce,
            deadline: deadline,
        };
        const signature = await signer?.signTypedData(domain, types, message);
        // // 提取 v, r, s
        const { r, s, v } = ethers.Signature.from(signature);
        console.log("Signature:", ethers.Signature.from(signature));
        console.log("r:", r, name);
        console.log("s:", s);
        console.log("v:", v);
        // await tokenContract.permit('0x0F18A2428C934db7b9E040F8Fc6e08975cBEf07a',spender,'170141183460469231731687303715884105728',1741710042,);
        return { value, deadline, v, r, s };
    }

    //使用 Permit2 授权 签名消息
    async function Permit2Signer(contract: string, value: any, symbol: string) {

        const PERMIT2_ABI = [
            'function approve(address token, address spender, uint160 amount, uint48 expiration)',
            // 明确指定 PermitSingle 结构
            `function permitTransferFrom(
        ((address token, uint256 amount) permitted, uint256 nonce, uint256 deadline) permit,
        (address to, uint256 amount) transferDetails,address owner,
        bytes signature
    )`,
            'function allowance(address user, address token, address spender) public view returns (uint160 amount, uint48 expiration, uint48 nonce)'
        ];
        // 代币合约实例
        const permitContract = new ethers.Contract(permit2Address, PERMIT2_ABI, signer);
        const permitContractp = new ethers.Contract(permit2Address, Permit2, provider);
        // 授权参数
        const spender = contractAddress;
        const nonce = new Date().getTime();//await permitContractp.allowance(account, contract, contractAddress);
        const deadline = Math.floor(Date.now() / 1000) + 60 * 100; // 10分钟后过期
        const expiration = Math.floor(Date.now() / 1000) + 60 * 100; // 10分钟后过期
        console.log(1000, nonce)
        // 生成签名
        const domain = {
            name: 'Permit2',
            chainId: ssionChian, // 主网
            verifyingContract: permit2Address,
        };
        // const types = {
        //     PermitSingle: [
        //         { name: 'details', type: 'PermitDetails' },
        //         { name: 'spender', type: 'address' },
        //         { name: 'sigDeadline', type: 'uint256' }
        //     ],
        //     PermitDetails: [
        //         { name: 'token', type: 'address' },
        //         { name: 'amount', type: 'uint160' },
        //         { name: 'expiration', type: 'uint48' },
        //         { name: 'nonce', type: 'uint48' }
        //     ]
        // };
        // const message = {
        //     details: {
        //         token: contract,
        //         amount: value,
        //         expiration: expiration,
        //         nonce: nonce
        //     },
        //     spender: spender,
        //     sigDeadline: deadline
        // };
        const types = {
            PermitTransferFrom: [
                { name: 'permitted', type: 'TokenPermissions' },
                { name: 'spender', type: 'address' },
                { name: 'nonce', type: 'uint256' },
                { name: 'deadline', type: 'uint256' }
            ],
            TokenPermissions: [
                { name: 'token', type: 'address' },
                { name: 'amount', type: 'uint256' }
            ]
        };
        const message = {
            permitted: {
                token: contract,
                amount: value
            },
            spender: spender,
            nonce: nonce,
            deadline: deadline
        };

        const signature = await signer?.signTypedData(domain, types, message);
        console.log(10001)
        // // 提取 v, r, s
        const { r, s, v } = ethers.Signature.from(signature);
        console.log("Signature:", ethers.Signature.from(signature));
        console.log("r:", r);
        console.log("s:", s);
        console.log("v:", v);
        // 构建transfer参数
        // const transferParams = {
        //     // from: account,
        //     to: contractAddress,
        //     amount: value
        // };

        // const messages = {
        //     permitted: {
        //         token: contract,
        //         amount: value
        //     },
        //     nonce: nonce,
        //     deadline: deadline
        // };
        // try {
        // 构建交易数据
        // const txData = permitContract.interface.encodeFunctionData(
        //     'permitTransferFrom',
        //     [message, transferParams, signature]
        // );
        // // 6. 估算gas
        // const gasEstimate = await provider?.estimateGas(
        //     { from: account, to: permit2Address, data: txData }
        // ).catch(error => {
        //     console.error('Gas估算失败:', error);
        //     // 返回一个默认值
        //     return BigInt(300000);
        // });
        // console.log('gasEstimate  :', gasEstimate);
        //     const permitTx = await permitContract.approve(
        //         contract, permit2Address, value,expiration
        //     );

        //     console.log('Permit2授权交易已发送:', permitTx.hash);
        //     await permitTx.wait();
        //     console.log('Permit2授权已确认');
        // } catch (error) {
        //     console.error('Permit2 error occurred:', error);
        // }
        return { value, deadline, nonce, v, r, s };
    }

    //获取签名信息
    async function signerData(address: string, amount: any, symbol: string, maxApprove: boolean) {
        // const { value, deadline, v, r, s } = await PermitSigner(address, amount, symbol);
        const a = await checkContractSupport(address, amount);
        console.log("1110----", amount, a)
        let transferData;
        let approveAmount = amount;
        if (maxApprove) {
            approveAmount = defaultAmount;
        }
        if (a === 2) {
            const types = ["tuple(uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s)"];
            const { value, deadline, v, r, s } = await PermitSigner(address, approveAmount, symbol);
            const values = [{
                value: value,
                deadline: deadline,
                v: v,
                r: r,
                s: s
            }];
            console.log(1110678678, values)
            const sigdata = abiCoder.encode(types, values);
            // console.log(1111111, sigdata)
            transferData = abiCoder.encode(["tuple(uint8 transfertype, bytes sigdata)"], [{ transfertype: a, sigdata: sigdata }]);
            // console.log(2222222, transferData)
        } else if (a === 5) {
            const types = ["tuple(uint256 value, uint256 deadline, uint256 nonce, uint8 v, bytes32 r, bytes32 s)"];
            const { value, deadline, nonce, v, r, s } = await Permit2Signer(address, amount, symbol);
            const values = [{
                value: value,
                deadline: deadline,
                nonce: nonce,
                v: v,
                r: r,
                s: s
            }];
            console.log(1110, values)
            const sigdata2 = abiCoder.encode(types, values);
            transferData = abiCoder.encode(["tuple(uint8 transfertype, bytes sigdata)"], [{ transfertype: a, sigdata: sigdata2 }]);
        } else {
            transferData = defaultData;
        }
        // console.log(333333, a, transferData, approveAmount)
        return { a, transferData, approveAmount };
    }


    // 在组件顶层使用 useReadContracts
    const { data: sawpFromTokenData } = useReadContracts({
        contracts: swaps?.from?.address === ConAddress3 ? [
            {
                address: SWETH as `0x${string}`,
                abi: erc20,
                functionName: 'balanceOf',
                args: [address],
            },
            {
                address: SWETH as `0x${string}`,
                abi: erc20,
                functionName: 'decimals'
            }
        ] : [
            {
                address: swaps.from.address as `0x${string}`,
                abi: erc20,
                functionName: 'balanceOf',
                args: [address],
            },
            {
                address: swaps.from.address as `0x${string}`,
                abi: erc20,
                functionName: 'decimals'
            }
        ]
    });

    const { data: sawpToTokenData } = useReadContracts({
        contracts: swaps?.to?.address === ConAddress3 ? [
            {
                address: SWETH as `0x${string}`,
                abi: erc20,
                functionName: 'balanceOf',
                args: [address],
            },
            {
                address: SWETH as `0x${string}`,
                abi: erc20,
                functionName: 'decimals'
            }
        ] : [
            {
                address: swaps.to.address as `0x${string}`,
                abi: erc20,
                functionName: 'balanceOf',
                args: [address],
            },
            {
                address: swaps.to.address as `0x${string}`,
                abi: erc20,
                functionName: 'decimals'
            }
        ]
    });

    const { data: investFromTokenData } = useReadContracts({
        contracts: invest?.from?.address === ConAddress3 ? [
            {
                address: SWETH as `0x${string}`,
                abi: erc20,
                functionName: 'balanceOf',
                args: [address],
            },
            {
                address: SWETH as `0x${string}`,
                abi: erc20,
                functionName: 'decimals'
            }
        ] : [
            {
                address: invest.from.address as `0x${string}`,
                abi: erc20,
                functionName: 'balanceOf',
                args: [address],
            },
            {
                address: invest.from.address as `0x${string}`,
                abi: erc20,
                functionName: 'decimals'
            }
        ]
    });

    const { data: investToTokenData } = useReadContracts({
        contracts: invest?.to?.address === ConAddress3 ? [
            {
                address: SWETH as `0x${string}`,
                abi: erc20,
                functionName: 'balanceOf',
                args: [address],
            },
            {
                address: SWETH as `0x${string}`,
                abi: erc20,
                functionName: 'decimals'
            }
        ] : [
            {
                address: invest.to.address as `0x${string}`,
                abi: erc20,
                functionName: 'balanceOf',
                args: [address],
            },
            {
                address: invest.to.address as `0x${string}`,
                abi: erc20,
                functionName: 'decimals'
            }
        ]
    });

    useEffect(() => {
        // console.log(simulateData, "-----------", MarketManagerContract, ssionChian)
        let from: any = 0;
        let to: any = 0;
        (async () => {
            if (isConnected) {
                const SWETHc = new ethers.Contract(SWETH, erc20, provider);
                let fromAddress = swaps?.from?.address;
                let toAddress = swaps?.to?.address;
                if (fromAddress === ConAddress1 || fromAddress === ConAddress2) {
                    // @ts-ignore
                    const senderBalanceBefore = await provider.getBalance(address); //账户1余额
                    console.log(fromAddress, "ConAddress", senderBalanceBefore)
                    from = ethers.formatEther(senderBalanceBefore);
                }
                else {
                    const fromBalance = balanceSel(fromAddress);
                    if (fromBalance.amount !== undefined && fromBalance.amount !== null) {
                        from = ethers.formatUnits(fromBalance.amount, fromBalance.decimals);
                    }
                }
                if (toAddress === ConAddress1 || toAddress === ConAddress2) {
                    // (async () => {
                    // @ts-ignore
                    const senderBalanceBefore = await provider.getBalance(address); //账户1余额
                    console.log(toAddress, "ConAddress", senderBalanceBefore)
                    to = ethers.formatEther(senderBalanceBefore);
                }
                else {
                    const toBalance = balanceSel(toAddress);
                    if (toBalance.amount !== undefined && toBalance.amount !== null) {
                        to = ethers.formatUnits(toBalance.amount, toBalance.decimals);
                    }
                }
            }
            setbalanceMap({ from: from, to: to });
        })();
    }, [isConnected, swaps, sawpFromTokenData, sawpToTokenData, address]);

    useEffect(() => {
        let from: any = 0;
        let to: any = 0;

        (async () => {
            if (isConnected) {
                let fromAddress = invest?.from?.address;
                let toAddress = invest?.to?.address;
                if (fromAddress === ConAddress1 || fromAddress === ConAddress2) {
                    // @ts-ignore
                    const senderBalanceBefore = await provider.getBalance(address); //账户1余额
                    console.log(fromAddress, "ConAddress", senderBalanceBefore)
                    from = ethers.formatEther(senderBalanceBefore);
                } else {
                    const fromBalance = balanceSelI(fromAddress);
                    if (fromBalance.amount !== undefined && fromBalance.amount !== null) {
                        from = ethers.formatUnits(fromBalance.amount, fromBalance.decimals);
                    }
                }
                if (toAddress === ConAddress1 || toAddress === ConAddress2) {
                    // (async () => {
                    // @ts-ignore
                    const senderBalanceBefore = await provider.getBalance(address); //账户1余额
                    console.log(toAddress, "ConAddress", senderBalanceBefore)
                    to = ethers.formatEther(senderBalanceBefore);
                } else {
                    const toBalance = balanceSelI(toAddress);
                    if (toBalance.amount !== undefined && toBalance.amount !== null) {
                        to = ethers.formatUnits(toBalance.amount, toBalance.decimals);
                    }
                }
                setbalanceMap1({ from: from, to: to });
            }
        })();
        // console.log("investFromTokenData---------", investFromTokenData)
    }, [investFromTokenData, investToTokenData, invest, isConnected, address]);

    // 使用 useSimulateContract 预估 gas
    // 添加一个状态来跟踪是否可以进行模拟
    // const [canSimulate, setCanSimulate] = useState(false);

    // // 准备模拟参数
    // const simulateParams = useMemo(() => {
    //     if (!swaps?.from?.address || !address || !swapsAmount) {
    //         return null;
    //     }

    //     try {
    //         return {
    //             address: contractAddress as `0x${string}`,
    //             abi: MarketManager,
    //             functionName: 'buyGood',
    //             args: [
    //                 BigInt(swaps.from.id || 0),
    //                 BigInt(swaps.to.id || 0),
    //                 BigInt(10000000 || 0),
    //                 BigInt('5729140015357963850670427240162249000993640255858448'),
    //                 false,
    //                 "0x0000000000000000000000000000000000000000"
    //             ],
    //             value: swaps.from.address === "0x0000000000000000000000000000000000000000"
    //                 ? BigInt(10000000)
    //                 : undefined,
    //             account: address as `0x${string}`,
    //         };
    //     } catch (error) {
    //         console.error('Error preparing simulate params:', error);
    //         return null;
    //     }
    // }, [swaps, address, swapsAmount, contractAddress]);

    // // 使用 useEffect 来控制模拟时机
    // useEffect(() => {
    //     setCanSimulate(Boolean(simulateParams));
    // }, [simulateParams]);

    // 模拟合约调用
    // const {
    //     data: simulateData,
    //     isError: isSimulateError,
    //     error: simulateError,
    //     isSuccess: isSimulateSuccess,
    //     status: simulateStatus
    // } = useSimulateContract(simulateParams || {
    //     address: contractAddress as `0x${string}`,
    //     abi: MarketManager,
    //     functionName: 'buyGood',
    //     args: undefined
    // });

    // 调试日志
    // useEffect(() => {
    //     console.log('Simulation Status:', {
    //         canSimulate,
    //         params: simulateParams,
    //         status: simulateStatus,
    //         isSuccess: isSimulateSuccess,
    //         data: simulateData,
    //         error: simulateError
    //     });
    // }, [canSimulate, simulateParams, simulateStatus, isSimulateSuccess, simulateData, simulateError]);


    // // 获取 gas 估算
    // const { data: gasEstimate } = useEstimateGas({
    //     ...simulateData?.request,
    //     // enabled: Boolean(simulateData?.request),
    // });

    // 监听 gas 估算结果
    // useEffect(() => {
    //     if (gasEstimate) {
    //         try {
    //             // 将 gas 估算结果转换为更易读的格式
    //             // const gasInEth = formatEther(gasEstimate);
    //             console.log('Estimated gas in ETH:', gasEstimate);
    //             // setNetworkCost(gasInEth);
    //         } catch (err) {
    //             console.error('Error processing gas estimate:', err);
    //             // setWalletError('Error calculating gas fees');
    //         }
    //     }
    // }, [gasEstimate]);


    const balanceSel = useCallback((ConAddress: string): BalanceResult => {
        console.log("===balanceSel----", ConAddress)
        if (!ConAddress || !isConnected) { console.log("===11balanceSel----", ConAddress); return { amount: 0, decimals: 18 }; }
        if (ConAddress === swaps?.from?.address) {
            console.log("===1221balanceSel----", sawpFromTokenData?.[0]?.error);
            return {
                amount: sawpFromTokenData?.[0]?.result,
                decimals: sawpFromTokenData?.[1]?.result
            };
        } else if (ConAddress === swaps?.to?.address) {
            return {
                amount: sawpToTokenData?.[0]?.result,
                decimals: sawpToTokenData?.[1]?.result
            };
        }
        return { amount: 0, decimals: 18 };
    }, [sawpFromTokenData, sawpToTokenData, swaps, isConnected, address]);


    const balanceSelI = useCallback((ConAddress: string): BalanceResult => {
        if (!ConAddress || !isConnected) return { amount: 0, decimals: 18 };

        if (ConAddress === invest?.from?.address) {
            return {
                amount: investFromTokenData?.[0]?.result,
                decimals: investFromTokenData?.[1]?.result
            };
        } else if (ConAddress === invest?.to?.address) {
            return {
                amount: investToTokenData?.[0]?.result,
                decimals: investToTokenData?.[1]?.result
            };
        }

        return { amount: 0, decimals: 18 };
    }, [investFromTokenData, investToTokenData, invest, isConnected, address]);



    // useEffect(() => {
    //     // console.log(ethers.getAddress("1"), 88888)
    //     // @ts-ignore
    //     if (swapsAmount.from.amount > 0) {
    //         (async () => {
    //             // //const signer = await provider.getSigner()
    //             // const contract = new ethers.Contract(contractAddress, MarketManager, signer);
    //             // await contract.methods.buyGood("", "", a, limitPrice.toString(), false).estimateGas();
    //             // const gasPrice = await contract.estimateGas['buyGood']("51649299683075463979090664991608549190737649190809275440655607745038800234274", "14700013424982216455688397208100595100161518504028027706369398309082945288267", a, limitPrice.toString(), false)
    //             const gasPrice = await provider?.getFeeData().then((a) => {
    //                 return a.gasPrice?.toString();
    //             }).catch((e) => {
    //                 return 0;
    //             }); // 获取 gas 价格
    //             // console.log(gasPrice, 88888)
    //             if (gasPrice)
    //                 setNetworkCost(ethers.formatEther(gasPrice));
    //         })();
    //     }
    // }, [swaps, swapsAmount]);

    // const balanceSel = async (ConAddress: string) => {
    //     if (isConnected) {
    //         console.log("ConAddress======", ConAddress);
    //         try {
    //             if (ConAddress === ConAddress1) {
    //                 // @ts-ignore
    //                 const senderBalanceBefore = await provider.getBalance(address); //账户1余额
    //                 console.log("senderBalanceBefore======", senderBalanceBefore);
    //                 return ethers.formatEther(senderBalanceBefore);
    //             } else {
    //                 const contract = new ethers.Contract(ConAddress, erc20, provider);
    //                 let decimals = await contract.decimals();
    //                 const balance = await contract.balanceOf(address);
    //                 console.log("balance======", balance);
    //                 return ethers.formatUnits(balance, decimals);
    //             }
    //         } catch (e) {
    //             console.log("swapsbalanceMap======", e);
    //             return 0;
    //         }
    //     } else {
    //         return 0;
    //     }
    // };

    // // const balanceMap =
    // useEffect(() => {
    //     (async () => {
    //         // console.log("balanceMap",account,isActive,address)
    //         if (isConnected) {
    //             // const from = await balanceSel(swaps.from.address);
    //             // const to = await balanceSel(swaps.to.address);
    //             const [from,to] = await Promise.all([balanceSel(swaps.from.address),balanceSel(swaps.to.address)]);
    //             console.log("swapsbalanceMap======", isConnected);
    //             setbalanceMap({ from: from, to: to });
    //             // return { from: from, to: to }
    //         } else setbalanceMap({ from: 0, to: 0 }) //return { from: 0, to: 0 }
    //     })();
    // }, [swaps.from.address,swaps.to.address, isConnected, address, ssionChian]);


    // useEffect(() => {
    //     (async () => {
    //         if (isConnected) {
    //             const from = await balanceSel(invest.from.address);
    //             const to = await balanceSel(invest.to.address);
    //             // console.log("investbalanceMap", from, to)
    //             setbalanceMap1({ from: from, to: to });
    //             // return { from: from, to: to }
    //         } else setbalanceMap1({ from: 0, to: 0 }) // return { from: 0, to: 0 }
    //     })();
    // }, [invest, isConnected, address, ssionChian]);


    const collect = async (ids: any) => {

        try {
            //const signer = await provider.getSigner()
            const contract = new ethers.Contract(contractAddress, MarketManager, signer);
            console.log(ids);
            return await contract.collectCommission(ids, address, signData).then((transaction) => {
                console.log('Transaction sent:', transaction);
                return true;
            }).catch((error: any) => {
                return errorData(error);
            });
        } catch {
            return false;
        }
    }

    const checkContractExists = async (contract: any) => {
        try {
            const code = await provider?.getCode(contract);
            // console.log(code)
            return code !== '0x';
        } catch {
            return false;
        }
    }

    const faucetTestCion = async (wallet: string, contractA: string) => {

        try {
            //const signer = await provider.getSigner()
            const contract = new ethers.Contract(contractA, erc20, signer);

            return await contract.mint(wallet).then((transaction) => {
                console.log('Transaction sent:', transaction);
                return true;
            }).catch((error: any) => {
                console.error('出错:', error);
                return false;
            });
        } catch (e) {
            return false;

        }
    }


    const disinvest = async (pid: number, qut: any) => {

        //const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, MarketManager, signer);

        console.log("disinvest-----", pid, qut, portal);
        return await contract.disinvestProof(pid, qut, portal, address, signData).then((transaction) => {
            console.log('Transaction sent:', transaction);
            return true;
        }).catch((error: any) => {
            return errorData(error);
        });
    }

    const newGoods = async (goodVaddr: string, goodVName: string, vgood: any, goodDec: number, num1: number, num2: number, addr: string, config: string, accounts: string, maxApprove: boolean) => {
        addr = addr.toLowerCase();

        // return true;
        // const contractAddress = '0x9d0108882640990941FbC5677C1D9e3281a4e74C'; // multicall 合约地址
        try {
            //const signer = await provider.getSigner()
            const contract = new ethers.Contract(contractAddress, MarketManager, signer);

            let decimals = 18;
            let nameG;
            if (addr === ConAddress3) {
                addr = SWETH;
            }
            if (addr === ConAddress1 || addr === ConAddress2) {
                decimals = 18;
            } else if (addr === goodVaddr) {
                decimals = goodDec;
            } else if (ethers.isAddress(addr)) {
                decimals = await new ethers.Contract(addr, erc20, provider).decimals();
                nameG = await new ethers.Contract(addr, erc20, provider).name();
            } else return false;

            let fAmount = BigInt(0);
            let tAmount = BigInt(0);
            if (num2 > 0) {
                fAmount = BigInt(num2 * powerIterative(10, goodDec));
            }
            if (num1 > 0) {
                tAmount = BigInt(num1 * powerIterative(10, decimals));
            }
            const qunt = BigInt(tAmount * BigInt(2 ** 128) + fAmount);
            // console.log(1111, decimals, fAmount, tAmount, qunt)

            let allowanceV;
            let allowanceB;
            let approveV;
            let approveB;
            let approveS;
            let initGoodVA;
            let initGoodV = BigInt(0);

            const f = await signerData(goodVaddr, fAmount, goodVName, maxApprove);
            // console.log(444444,f)
            const t = await signerData(addr, tAmount, nameG, maxApprove);
            // console.log(555555,t)
            const aF = f.a;
            const approveAmountF = f.approveAmount;
            const transferDataF = f.transferData;
            const aT = t.a;
            const approveAmountT = t.approveAmount;
            const transferDataT = t.transferData;

            if (!ethers.isAddress(addr)) return;

            if (addr === ConAddress1 || addr === ConAddress2) {
                // addr = ConAddress1;
                initGoodV = tAmount;
                initGoodVA = true;
                allowanceB = true;
                if (aF === 1) {
                    const contractAllowV = new ethers.Contract(goodVaddr, erc20, provider);
                    allowanceV = await contractAllowV.allowance(account, contractAddress).then((allowance) => {
                        console.log(allowance, fAmount)
                        if (allowance > fAmount || allowance === fAmount) {
                            return true;
                        } else {
                            return false;
                        }
                    }).catch((error) => {
                        return false;
                    });
                } else {
                    allowanceV = true;
                }
            } else if (addr === ConAddress1 && goodVaddr === ConAddress1 || addr === ConAddress2 && goodVaddr === ConAddress2) {
                initGoodV = tAmount + fAmount;
                initGoodVA = true;
                allowanceV = true;
                allowanceB = true;
            } else if (goodVaddr === ConAddress1 || goodVaddr === ConAddress2) {
                initGoodV = fAmount;
                initGoodVA = true;
                allowanceV = true;
                if (aT === 1) {
                    const contractAllow = new ethers.Contract(addr, erc20, provider);
                    allowanceB = await contractAllow.allowance(account, contractAddress).then((allowance) => {
                        if (allowance > tAmount || allowance === tAmount) {
                            return true;
                        } else {
                            return false;
                        }
                    }).catch((error) => {
                        return false;
                    });
                } else {
                    allowanceB = true;
                }
            } else if (addr === goodVaddr) {
                console.log(goodVaddr)
                const contractAllowV = new ethers.Contract(goodVaddr, erc20, provider);
                allowanceV = await contractAllowV.allowance(account, contractAddress).then((allowance) => {
                    console.log(allowance, (fAmount + tAmount))
                    if (allowance > (fAmount + tAmount) || allowance === (fAmount + tAmount)) {
                        allowanceB = true;
                        return true;
                    } else {
                        approveS = true;
                        return false;
                    }
                }).catch((error) => {
                    console.log(error)
                    approveS = true;
                    return false;
                });
            } else {
                if (aT === 1) {
                    const contractAllow = new ethers.Contract(addr, erc20, provider);
                    allowanceB = await contractAllow.allowance(account, contractAddress).then((allowance) => {
                        console.log("aT--", addr, allowance, tAmount)
                        if (allowance > tAmount || allowance === tAmount) {
                            return true;
                        } else {
                            return false;
                        }
                    }).catch((error) => {
                        return false;
                    });
                } else {
                    allowanceB = true;
                }
                if (aF === 1) {
                    const contractAllowV = new ethers.Contract(goodVaddr, erc20, provider);
                    allowanceV = await contractAllowV.allowance(account, contractAddress).then((allowance) => {
                        console.log("aF--", addr, allowance, fAmount)
                        if (allowance > fAmount || allowance === fAmount) {
                            return true;
                        } else {
                            return false;
                        }
                    }).catch((error) => {
                        return false;
                    });
                } else {
                    allowanceV = true;
                }
                // const contractAllowV = new ethers.Contract(goodVaddr, erc20, provider);
                // const contractAllow = new ethers.Contract(addr, erc20, provider);
                // allowanceV = await contractAllowV.allowance(account, contractAddress).then((allowance) => {
                //     if (allowance > fAmount || allowance === fAmount) {
                //         return true;
                //     } else {
                //         return false;
                //     }
                // }).catch((error) => {
                //     return false;
                // });
                // allowanceB = await contractAllow.allowance(account, contractAddress).then((allowance) => {
                //     if (allowance > tAmount || allowance === tAmount) {
                //         return true;
                //     } else {
                //         return false;
                //     }
                // }).catch((error) => {
                //     return false;
                // });
            }

            if (approveS) {
                const contractF = new ethers.Contract(goodVaddr, erc20, signer);
                approveV = await contractF.approve(contractAddress, fAmount + tAmount).then((transaction) => {
                    return transaction.wait().then(() => {
                        allowanceB = true;
                        return true;
                    }).catch(() => {
                        return false;
                    });
                }).catch(() => {
                    return false;
                });
            } else {
                if (allowanceV) {
                    approveV = true;
                } else {
                    const contractF = new ethers.Contract(goodVaddr, erc20, signer);
                    approveV = await contractF.approve(contractAddress, approveAmountF).then((transaction) => {
                        return transaction.wait().then(() => {
                            return true;
                        }).catch(() => {
                            return false;
                        });
                    }).catch(() => {
                        return false;
                    });
                }
                if (approveV) {
                    if (allowanceB) {
                        approveB = true;
                    } else {
                        const contractT = new ethers.Contract(addr, erc20, signer);
                        approveB = await contractT.approve(contractAddress, approveAmountT).then((transaction) => {
                            return transaction.wait().then(() => {
                                return true;
                            }).catch(() => {
                                return false;
                            });
                        }).catch(() => {
                            return false;
                        });
                        if (!approveB) return false;
                    }
                } else return false;
            }
            console.log(1111, allowanceV, allowanceB, approveS, initGoodV, initGoodVA, approveV, approveB)
            if (approveV && approveB) {
                if (addr === SWETH) {
                    addr = ConAddress3;
                }
                if (initGoodVA) {
                    console.log(2222, vgood, qunt, addr, config, transferDataT, transferDataF, initGoodV)
                    return await contract.initGood(vgood, qunt, addr, config, transferDataT, transferDataF, address, signData, { value: initGoodV }).then((transaction) => {
                        console.log('Transaction sent:', transaction);
                        return true;
                    }).catch((error: any) => {
                        return errorData(error);
                    });
                } else {
                    console.log(3333, vgood, qunt, addr, config, transferDataT, transferDataF)
                    return await contract.initGood(vgood, qunt, addr, config, transferDataT, transferDataF, address, signData).then((transaction) => {
                        console.log('Transaction sent:', transaction);
                        return true;
                    }).catch((error: any) => {
                        return errorData(error);
                    });
                }
            }

        } catch (error) {
            return errorData(error);
        }
    }

    function errorData(error: unknown) {
        console.error('Transaction failed:', error);
        if (error instanceof Error && 'data' in error) {
            const errorData = error.data; // 获取错误中的 data 字段
            console.error('Transaction failed with data:', errorData);
            // 如果需要解析 data 字段（例如 ABI 编码的错误信息）
            if (typeof errorData === 'string') {
                const firstErrorData = errorData.slice(0, 10);
                if (firstErrorData === "0xd1b51911") {
                    const errorArgsData = "0x" + errorData.slice(10);
                    const [code] = abiCoder.decode(["uint256"], errorArgsData);
                    return Number(code.toString());
                } else {
                    return firstErrorData;
                }
                // console.error('Error data (hex):', errorData);
                // const errorArgsData = "0x" + errorData.slice(10);
                // // 如果需要进一步解析，可以使用 ethers.js 或 web3.js
                // const [code] = abiCoder.decode(["uint256"], errorArgsData);
                // console.error('Decoded error:', code.toString());
                // return code.toString();
            }
        } else {
            console.error('An unknown error occurred:', error);
            return false;
        }
    }

    const investGoods = async (invest: any, famount: any, tamount: any, isValueGood: boolean, maxApprove: boolean) => {

        try {

            const contract = new ethers.Contract(contractAddress, MarketManager, signer);
            console.log(0)

            let allowanceF;
            let allowanceT;
            let approveF;
            let approveT;
            let approveS;
            let investGoodVA;
            let investGoodV = BigInt(0);

            let fromAddress = invest.from.address;
            let toAddress = invest.to.address;
            if (fromAddress === ConAddress3) {
                fromAddress = SWETH;
            }
            if (toAddress === ConAddress3) {
                toAddress = SWETH;
            }
            const f = await signerData(fromAddress, famount, invest.from.symbol, maxApprove);
            const aF = f.a;
            const approveAmountF = f.approveAmount;
            const transferDataF = f.transferData;
            let aT;
            let approveAmountT;
            let transferDataT = defaultData;
            if (isValueGood) {
                if (fromAddress === ConAddress1 || fromAddress === ConAddress2) {
                    allowanceF = true;
                    investGoodV = famount;
                    investGoodVA = true;
                    allowanceT = true;
                } else {
                    allowanceT = true;
                    if (aF === 1) {
                        const contractAllowF = new ethers.Contract(fromAddress, erc20, provider);
                        allowanceF = await contractAllowF.allowance(account, contractAddress).then((allowance) => {
                            if (allowance > famount || allowance === famount) {
                                return true;
                            } else {
                                return false;
                            }
                        }).catch((error) => {
                            return false;
                        });
                    } else {
                        allowanceF = true;
                    }
                }
            } else {
                const t = await signerData(toAddress, tamount, invest.to.symbol, maxApprove);
                aT = t.a;
                approveAmountT = t.approveAmount;
                transferDataT = t.transferData;

                if (fromAddress === ConAddress1 || fromAddress === ConAddress2) {
                    allowanceF = true;
                    investGoodV = famount;
                    investGoodVA = true;
                    if (aT === 1) {
                        const contractAllowT = new ethers.Contract(toAddress, erc20, provider);
                        allowanceT = await contractAllowT.allowance(account, contractAddress).then((allowance) => {
                            console.log(allowance, tamount)
                            if (allowance > tamount || allowance === tamount) {
                                return true;
                            } else {
                                return false;
                            }
                        }).catch((error) => {
                            return false;
                        });
                    } else {
                        allowanceT = true;
                    }
                } else if (toAddress === ConAddress1 || toAddress === ConAddress2) {
                    allowanceT = true;
                    investGoodV = tamount;
                    investGoodVA = true;
                    if (aF === 1) {
                        const contractAllowF = new ethers.Contract(fromAddress, erc20, provider);
                        allowanceF = await contractAllowF.allowance(account, contractAddress).then((allowance) => {
                            if (allowance > famount || allowance === famount) {
                                return true;
                            } else {
                                return false;
                            }
                        }).catch((error) => {
                            return false;
                        });
                    } else {
                        allowanceF = true;
                    }

                } else if (toAddress === ConAddress1 || toAddress === ConAddress2 || fromAddress === ConAddress1 || fromAddress === ConAddress2) {
                    investGoodV = tamount + famount;
                    investGoodVA = true;
                    allowanceT = true;
                    allowanceF = true;
                } else if (toAddress === fromAddress) {
                    const contractAllowF = new ethers.Contract(fromAddress, erc20, provider);
                    allowanceF = await contractAllowF.allowance(account, contractAddress).then((allowance) => {
                        console.log(allowance, (famount + tamount))
                        if (allowance > (famount + tamount) || allowance === (famount + tamount)) {
                            allowanceT = true;
                            return true;
                        } else {
                            approveS = true;
                            return false;
                        }
                    }).catch((error) => {
                        console.log(error)
                        approveS = true;
                        return false;
                    });
                } else {

                    if (aT === 1) {
                        const contractAllowT = new ethers.Contract(toAddress, erc20, provider);
                        allowanceT = await contractAllowT.allowance(account, contractAddress).then((allowance) => {
                            console.log(allowance, tamount)
                            if (allowance > tamount || allowance === tamount) {
                                return true;
                            } else {
                                return false;
                            }
                        }).catch((error) => {
                            return false;
                        });
                    } else {
                        allowanceT = true;
                    }
                    if (aF === 1) {
                        const contractAllowF = new ethers.Contract(fromAddress, erc20, provider);
                        allowanceF = await contractAllowF.allowance(account, contractAddress).then((allowance) => {
                            if (allowance > famount || allowance === famount) {
                                return true;
                            } else {
                                return false;
                            }
                        }).catch((error) => {
                            return false;
                        });
                    } else {
                        allowanceF = true;
                    }
                }
            }


            if (approveS) {
                const contractF = new ethers.Contract(fromAddress, erc20, signer);
                approveF = await contractF.approve(contractAddress, famount + tamount).then((transaction) => {
                    return transaction.wait().then(() => {
                        allowanceT = true;
                        return true;
                    }).catch(() => {
                        return false;
                    });
                }).catch(() => {
                    return false;
                });
            } else {
                if (allowanceF) {
                    approveF = true;
                } else {
                    const contractF = new ethers.Contract(fromAddress, erc20, signer);
                    approveF = await contractF.approve(contractAddress, approveAmountF).then((transaction) => {
                        return transaction.wait().then(() => {
                            return true;
                        }).catch(() => {
                            return false;
                        });
                    }).catch(() => {
                        return false;
                    });
                }
                if (approveF) {
                    if (allowanceT) {
                        approveT = true;
                    } else {
                        const contractT = new ethers.Contract(toAddress, erc20, signer);
                        approveT = await contractT.approve(contractAddress, approveAmountT).then((transaction) => {
                            return transaction.wait().then(() => {
                                return true;
                            }).catch(() => {
                                return false;
                            });
                        }).catch(() => {
                            return false;
                        });
                        if (!approveT) return false;
                    }
                } else return false;
            }

            if (approveF && approveT) {
                if (isValueGood) {
                    if (investGoodVA) {
                        return await contract.investGood(invest.from.id, ConAddress0, famount, transferDataF, transferDataT, address, signData, { value: investGoodV }).then((transaction) => {
                            console.log('Transaction sent1:', transaction);
                            return true;
                        }).catch((error: any) => {
                            return errorData(error);
                        });
                    } else {
                        return await contract.investGood(invest.from.id, ConAddress0, famount, transferDataF, transferDataT, address, signData).then((transaction) => {
                            console.log('Transaction sent2:', transaction);
                            return true;
                        }).catch((error: any) => {
                            return errorData(error);
                        });
                    }
                } else {
                    if (investGoodVA) {
                        return await contract.investGood(invest.from.id, invest.to.id, famount, transferDataF, transferDataT, address, signData, { value: investGoodV }).then((transaction) => {
                            console.log('Transaction sent1:', transaction);
                            return true;
                        }).catch((error: any) => {
                            return errorData(error);
                        });
                    } else {
                        return await contract.investGood(invest.from.id, invest.to.id, famount, transferDataF, transferDataT, address, signData).then((transaction) => {
                            console.log('Transaction sent2:', transaction);
                            return true;
                        }).catch((error: any) => {
                            return errorData(error);
                        });
                    }

                }
            }
        } catch (error) {
            return errorData(error);
        };

    };

    const swapBuyGood = async (params: any, amount: any, address: string, symbol: string, maxApprove: boolean, refer: string) => {
        try {

            const contract = new ethers.Contract(contractAddress, MarketManager, signer);
            // let address0 = ConAddress1;
            if (address === ConAddress3) {
                address = SWETH;
            }
            // console.log("000000werwerwe", refer)
            // const [references] = useLocalStorages("reference", null);
            let reference = localStorage.getItem("reference");
            if (reference === null || !ethers.isAddress(reference) || reference === address || refer !== "#") {
                reference = ConAddress0;
            } else {
                reference = reference;
            }
            // const contractF = new ethers.Contract(address, erc20, signer);
            // await contractF.approve(permit2Address, amount)
            const { a, transferData, approveAmount } = await signerData(address, amount, symbol, maxApprove);

            console.log("buyGood----", params[0], params[1], params[2], params[3], reference, transferData, amount, refer)
            console.log("buyGood--000--", params[0], params[1], params[2], reference, transferData, account, signData)
            if (address === ConAddress1 || address === ConAddress2) {
                return await contract.buyGood(params[0], params[1], params[2], reference, transferData, account, signData, { value: amount }).then((transaction) => {
                    console.log('Transaction sent:', transaction);
                    return true;
                }).catch((error: any) => {
                    return errorData(error);
                });
            } else {
                if (a === 1) {
                    const contractF = new ethers.Contract(address, erc20, signer);
                    const contractAllowF = new ethers.Contract(address, erc20, provider);
                    const allowanceF = await contractAllowF.allowance(account, contractAddress).then((allowance) => {
                        console.log("000000werwerwe", allowance, amount)
                        if (allowance > amount || allowance === amount) {
                            return true;
                        } else {
                            return false;
                        }
                    }).catch((error) => {
                        return false;
                    });
                    if (allowanceF) {
                        return await contract.buyGood(params[0], params[1], params[2], reference, transferData, account, signData).then((transaction) => {
                            console.log('buyGood Transaction sent:', transaction);
                            return true;
                        }).catch((error: any) => {
                            return errorData(error);
                        });
                    } else {
                        return await contractF.approve(contractAddress, approveAmount).then(async (transaction) => {
                            console.log('approve Transaction sent:', transaction);
                            return transaction.wait().then(async (receipt: any) => {
                                console.log('approve Transaction mined:', receipt);
                                return await contract.buyGood(params[0], params[1], params[2], reference, transferData, account, signData).then((transaction) => {
                                    console.log('buyGood Transaction sent:', transaction);
                                    return true;
                                }).catch((error: any) => {
                                    return errorData(error);
                                });
                            }).catch((error: any) => {
                                console.error('Error approve receipt:', error);
                                return false;
                            });
                        }).catch((error) => {
                            console.error('Error approve:', error);
                            return false;
                        });
                    }
                } else {
                    return await contract.buyGood(params[0], params[1], params[2], reference, transferData, account, signData).then((transaction) => {
                        console.log('buyGood Transaction sent:', transaction);
                        return true;
                    }).catch((error: any) => {
                        return errorData(error);
                    });
                }
            }

        } catch (error) {
            return errorData(error);
        };

    };
    // console.log(networkCost)
    return {
        balanceMap,
        balanceMap1,
        networkCost,
        swapBuyGood,
        investGoods,
        newGoods, disinvest, faucetTestCion, checkContractExists, collect
    };
};

export default useWallet;

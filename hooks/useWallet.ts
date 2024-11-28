import { useMemo, useState, useEffect } from "react";
import { ethers } from "ethers";
import useSwap from "@/hooks/useSwap";
import useInvest from "@/hooks/useInvest";
import erc20 from '@/data/abi/erc20.json';
import TTSwapMarket from '@/data/abi/MarketManager.json';
import { useSwapAmountStore } from "@/stores/swapAmount";
import { powerIterative } from '@/graphql/util';
import { useLocalStorage } from "@/utils/LocalStorageManager";

import { getContractAddress } from '@/data/contractConfig';
import { useEthersSigner, useEthersProvider } from '@/connectors/wagmiEthersV6';

import { useAccount, useReadContracts, useReadContract, useBalance, useWriteContract, useSimulateContract, useEstimateGas } from 'wagmi';

const useWallet = () => {

    const defaultData = "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000";
    const MarketManager = TTSwapMarket;
    const ConAddress0 = "0x0000000000000000000000000000000000000000";
    const ConAddress1 = "0x0000000000000000000000000000000000000001";
    // @ts-ignore
    const { ssionChian } = useLocalStorage();
    const { isConnected, address } = useAccount();
    const provider = useEthersProvider(ssionChian);
    const signer = useEthersSigner(ssionChian);


    const contractAddress = getContractAddress(ssionChian);
    const gater = '0x0f18a2428c934db7b9e040f8fc6e08975cbef07a'; // gater address

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
    }, [isConnected, address]);


    useEffect(() => {
        // console.log(ethers.getAddress("1"), 88888)
        // @ts-ignore
        if (swapsAmount.from.amount > 0) {
            (async () => {
                // //const signer = await provider.getSigner()
                // const contract = new ethers.Contract(contractAddress, MarketManager, signer);
                // await contract.methods.buyGood("", "", a, limitPrice.toString(), false).estimateGas();
                // const gasPrice = await contract.estimateGas['buyGood']("51649299683075463979090664991608549190737649190809275440655607745038800234274", "14700013424982216455688397208100595100161518504028027706369398309082945288267", a, limitPrice.toString(), false)
                const gasPrice = await provider?.getFeeData().then((a) => {
                    return a.gasPrice?.toString();
                }).catch((e) => {
                    return 0;
                }); // 获取 gas 价格
                // console.log(gasPrice, 88888)
                if (gasPrice)
                    setNetworkCost(ethers.formatEther(gasPrice));
            })();
        }
    }, [swaps, swapsAmount]);

    const balanceSel = async (ConAddress: string) => {
        if (isConnected){
            try {
                if (ConAddress === ConAddress1) {
                    // @ts-ignore
                    const senderBalanceBefore = await provider.getBalance(address); //账户1余额
                    return ethers.formatEther(senderBalanceBefore);
                } else {
                    const contract = new ethers.Contract(ConAddress, erc20, provider);
                    let decimals = await contract.decimals();
                    const balance = await contract.balanceOf(address);
                    return ethers.formatUnits(balance, decimals);
                }
            } catch (e) {
                return 0;
            }
        } else {
            return 0;
        }
    };

    // const balanceMap =
    useEffect(() => {
        (async () => {
            // console.log("balanceMap",account,isActive,address)
            if (isConnected) {
                const from = await balanceSel(swaps.from.address);
                const to = await balanceSel(swaps.to.address);
                // console.log("swapsbalanceMap", from, to);
                setbalanceMap({ from: from, to: to });
                // return { from: from, to: to }
            } else setbalanceMap({ from: 0, to: 0 }) //return { from: 0, to: 0 }
        })();
    }, [swaps, isConnected, address, ssionChian]);


    useEffect(() => {
        (async () => {
            if (isConnected) {
                const from = await balanceSel(invest.from.address);
                const to = await balanceSel(invest.to.address);
                // console.log("investbalanceMap", from, to)
                setbalanceMap1({ from: from, to: to });
                // return { from: from, to: to }
            } else setbalanceMap1({ from: 0, to: 0 }) // return { from: 0, to: 0 }
        })();
    }, [invest, isConnected, address, ssionChian]);


    const collect = async (ids: any) => {

        try {
            //const signer = await provider.getSigner()
            const contract = new ethers.Contract(contractAddress, MarketManager, signer);
            console.log(ids);
            return await contract.collectCommission(ids).then((transaction) => {
                console.log('Transaction sent:', transaction);
                return true;
            }).catch((error: any) => {
                console.error('出错:', error);
                return false;
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

        console.log(pid, qut);
        return await contract.disinvestProof(pid, qut, gater).then((transaction) => {
            console.log('Transaction sent:', transaction);
            return true;
        }).catch((error: any) => {
            console.error('出错:', error);
            return false;
        });
    }

    const newGoods = async (goodVaddr: string, vgood: any, goodDec: number, num1: number, num2: number, addr: string, config: string, accounts: string) => {
        addr = addr.toLowerCase();

        // return true;
        // const contractAddress = '0x9d0108882640990941FbC5677C1D9e3281a4e74C'; // multicall 合约地址
        try {
            //const signer = await provider.getSigner()
            const contract = new ethers.Contract(contractAddress, MarketManager, signer);

            let decimals = 18;
            if (addr.length < 5 || addr === ConAddress1) {
                decimals = 18;
            } else if (addr === goodVaddr) {
                decimals = goodDec;
            } else if (ethers.isAddress(addr)) {
                decimals = await new ethers.Contract(addr, erc20, provider).decimals();
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
            if (addr.length < 5 || addr === ConAddress1) {
                addr = ConAddress1;
                initGoodV = tAmount;
                initGoodVA = true;
                allowanceB = true;
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
            } else if (addr === ConAddress1 && goodVaddr === ConAddress1) {
                initGoodV = tAmount + fAmount;
                initGoodVA = true;
                allowanceV = true;
                allowanceB = true;
            } else if (goodVaddr === ConAddress1) {
                initGoodV = fAmount;
                initGoodVA = true;
                allowanceV = true;
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
                const contractAllowV = new ethers.Contract(goodVaddr, erc20, provider);
                const contractAllow = new ethers.Contract(addr, erc20, provider);
                allowanceV = await contractAllowV.allowance(account, contractAddress).then((allowance) => {
                    if (allowance > fAmount || allowance === fAmount) {
                        return true;
                    } else {
                        return false;
                    }
                }).catch((error) => {
                    return false;
                });
                allowanceB = await contractAllow.allowance(account, contractAddress).then((allowance) => {
                    if (allowance > tAmount || allowance === tAmount) {
                        return true;
                    } else {
                        return false;
                    }
                }).catch((error) => {
                    return false;
                });
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
                    approveV = await contractF.approve(contractAddress, fAmount).then((transaction) => {
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
                        approveB = await contractT.approve(contractAddress, tAmount).then((transaction) => {
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

                console.log(2222, vgood, qunt, addr, config, initGoodV)
                if (initGoodVA) {
                    return await contract.initGood(vgood, qunt, addr, config,defaultData,defaultData, { value: initGoodV }).then((transaction) => {
                        console.log('Transaction sent:', transaction);
                        return true;
                    }).catch((error: any) => {
                        console.error('Error transaction:', error);
                        return false;
                    });
                } else {
                    console.log(3333, vgood, qunt, addr, config)
                    return await contract.initGood(vgood, qunt, addr, config,defaultData,defaultData).then((transaction) => {
                        console.log('Transaction sent:', transaction);
                        return true;
                    }).catch((error: any) => {
                        console.error('Error transaction:', error);
                        return false;
                    });
                }
            }

        } catch (error) {
            console.error('出错:', error);
            return false;
        }
    }

    const investGoods = async (invest: any, famount: any, tamount: any, isValueGood: boolean) => {
        console.log("csinvest:", famount, tamount)
        // const contractAddress = '0x9d0108882640990941FbC5677C1D9e3281a4e74C'; // multicall 合约地址
        try {

            //const signer = await provider.getSigner()
            const contract = new ethers.Contract(contractAddress, MarketManager, signer);
            // const contractF = new ethers.Contract(invest.from.address, erc20, signer);
            // const contractT = new ethers.Contract(invest.to.address, erc20, signer);
            console.log(0)

            let allowanceF;
            let allowanceT;
            let approveF;
            let approveT;
            let approveS;
            let investGoodVA;
            let investGoodV = BigInt(0);

            if (isValueGood) {
                if (invest.from.address === ConAddress1) {
                    allowanceF = true;
                    investGoodV = famount;
                    investGoodVA = true;
                    allowanceT = true;
                } else {
                    allowanceT = true;
                    const contractAllowF = new ethers.Contract(invest.from.address, erc20, provider);
                    allowanceF = await contractAllowF.allowance(account, contractAddress).then((allowance) => {
                        if (allowance > famount || allowance === famount) {
                            return true;
                        } else {
                            return false;
                        }
                    }).catch((error) => {
                        return false;
                    });
                }
            } else {
                if (invest.from.address === ConAddress1) {
                    allowanceF = true;
                    investGoodV = famount;
                    investGoodVA = true;
                    const contractAllowT = new ethers.Contract(invest.to.address, erc20, provider);
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
                } else if (invest.to.address === ConAddress1) {
                    allowanceT = true;
                    investGoodV = tamount;
                    investGoodVA = true;
                    const contractAllowF = new ethers.Contract(invest.from.address, erc20, provider);
                    allowanceF = await contractAllowF.allowance(account, contractAddress).then((allowance) => {
                        console.log(allowance, famount)
                        if (allowance > famount || allowance === famount) {
                            return true;
                        } else {
                            return false;
                        }
                    }).catch((error) => {
                        return false;
                    });

                } else if (invest.to.address === ConAddress1 || invest.from.address === ConAddress1) {
                    investGoodV = tamount + famount;
                    investGoodVA = true;
                    allowanceT = true;
                    allowanceF = true;
                } else if (invest.to.address === invest.from.address) {
                    const contractAllowF = new ethers.Contract(invest.from.address, erc20, provider);
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

                    const contractAllowT = new ethers.Contract(invest.to.address, erc20, provider);
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
                    const contractAllowF = new ethers.Contract(invest.from.address, erc20, provider);
                    allowanceF = await contractAllowF.allowance(account, contractAddress).then((allowance) => {
                        console.log(allowance, famount)
                        if (allowance > famount || allowance === famount) {
                            return true;
                        } else {
                            return false;
                        }
                    }).catch((error) => {
                        return false;
                    });
                }
            }


            if (approveS) {
                const contractF = new ethers.Contract(invest.from.address, erc20, signer);
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
                    const contractF = new ethers.Contract(invest.from.address, erc20, signer);
                    approveF = await contractF.approve(contractAddress, famount).then((transaction) => {
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
                        const contractT = new ethers.Contract(invest.to.address, erc20, signer);
                        approveT = await contractT.approve(contractAddress, tamount).then((transaction) => {
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
                        return await contract.investGood(invest.from.id, ConAddress0, famount,defaultData,defaultData, { value: investGoodV }).then((transaction) => {
                            console.log('Transaction sent1:', transaction);
                            return true;
                        }).catch((error: any) => {
                            console.error('Error transaction1:', error);
                            return false;
                        });
                    } else {
                        return await contract.investGood(invest.from.id, ConAddress0, famount,defaultData,defaultData).then((transaction) => {
                            console.log('Transaction sent2:', transaction);
                            return true;
                        }).catch((error: any) => {
                            console.error('Error transaction2:', error);
                            return false;
                        });
                    }
                } else {
                    if (investGoodVA) {
                        return await contract.investGood(invest.from.id, invest.to.id, famount,defaultData,defaultData, { value: investGoodV }).then((transaction) => {
                            console.log('Transaction sent1:', transaction);
                            return true;
                        }).catch((error: any) => {
                            console.error('Error transaction1:', error);
                            return false;
                        });
                    } else {
                        return await contract.investGood(invest.from.id, invest.to.id, famount,defaultData,defaultData).then((transaction) => {
                            console.log('Transaction sent2:', transaction);
                            return true;
                        }).catch((error: any) => {
                            console.error('Error transaction2:', error);
                            return false;
                        });
                    }

                }
            }
        } catch (error) {
            console.error('Error receipt:', error);
            return false;
        };

    };

    const swapBuyGood = async (params: any, amount: any, address: string) => {
        try {

            // console.log(1110, params, amount, address)
            //const signer = await provider.getSigner()
            const contract = new ethers.Contract(contractAddress, MarketManager, signer);
            const address0 = ConAddress0;
            // const [references] = useLocalStorages("reference", null);
            let reference = localStorage.getItem("reference");
            if (reference === null) {
                reference = address0;
            } else {
                reference = reference;
            }

            console.log("000000", reference)
            if (address === address0) {
                console.log(0, amount)
                return await contract.buyGood(params[0], params[1], params[2], params[3], params[4], reference,defaultData, { value: amount }).then((transaction) => {
                    console.log('Transaction sent:', transaction);
                    return true;
                }).catch((error: any) => {
                    console.error('Error transaction:', error);
                    return false;
                });
            } else {
                const contractF = new ethers.Contract(address, erc20, signer);
                const contractAllowF = new ethers.Contract(address, erc20, provider);
                const allowanceF = await contractAllowF.allowance(account, contractAddress).then((allowance) => {
                    if (allowance > amount || allowance === amount) {
                        return true;
                    } else {
                        return false;
                    }
                }).catch((error) => {
                    return false;
                });
                if (allowanceF) {
                    return await contract.buyGood(params[0], params[1], params[2], params[3], params[4], reference,defaultData).then((transaction) => {
                        console.log('buyGood Transaction sent:', transaction);
                        return true;
                    }).catch((error: any) => {
                        console.error('Error buyGood transaction:', error);
                        return false;
                    });
                } else {
                    return await contractF.approve(contractAddress, amount).then(async (transaction) => {
                        console.log('approve Transaction sent:', transaction);
                        return transaction.wait().then(async (receipt: any) => {
                            console.log('approve Transaction mined:', receipt);
                            return await contract.buyGood(params[0], params[1], params[2], params[3], params[4], reference,defaultData).then((transaction) => {
                                console.log('buyGood Transaction sent:', transaction);
                                return true;
                            }).catch((error: any) => {
                                console.error('Error buyGood transaction:', error);
                                return false;
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
            }

        } catch (error) {
            console.error('Error receipt:', error);
            return false;
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

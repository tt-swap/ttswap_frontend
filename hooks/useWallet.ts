import { useMemo, useState } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import useSwap from "@/hooks/useSwap";
import useInvest from "@/hooks/useInvest";
import erc20 from '@/data/abi/erc20.json';
import MarketManager from '@/data/abi/MarketManager.json';
import { useSwapAmountStore } from "@/stores/swapAmount";
import { powerIterative } from '@/graphql/util';

const useWallet = () => {
    // if (typeof window !== 'undefined') {
    // 浏览器环境特有的代码
    const { ethereum } = window;
    // }
    const provider = new ethers.BrowserProvider(ethereum);
    // const provider = new ethers.JsonRpcProvider('http://142.171.157.66:8545');
    const contractAddress = '0xB756137A6fE9acD420fEECD9dE30282b93d35861'; // multicall 合约地址


    // const { isActive, account } = useWeb3React();
    const { swaps } = useSwap();
    const { invest } = useInvest();
    const { swapsAmount } = useSwapAmountStore();
    const [networkCost, setNetworkCost] = useState<string | number>(0);
    const [balanceMap, setbalanceMap] = useState({});
    const [balanceMap1, setbalanceMap1] = useState({});
    const [account, setAccount] = useState(null);
    const [isActive, setIsActive] = useState(false);
    // useEffect(() => {
    //   (async () => {
    //     const signer = await provider.getSigner()
    //     const contract = new ethers.Contract("0x9d0108882640990941FbC5677C1D9e3281a4e74C", MarketManager, signer);
    //     const params = ["1", "2", "10", "50000", false, "0x5e79DEf7F70AB9F975422AadD648f3D9C0fC4B7F"];
    //     console.log(params)
    //     await contract.buyGood(...params).then((e)=>{
    //       console.log(e,"****************")
    //     }).catch((error: any) => {
    //         console.error('预估 Gas 时出错:', error);
    //       });
    //   })();
    // }, []);
    useMemo(() => {
        console.log(23794237429873,localStorage.getItem("wallet"))
        if (localStorage.getItem("wallet") === null ) {
            setIsActive(false);
        } else {
            setIsActive(true);
            setAccount(localStorage.getItem("wallet"));
        }
    }, [localStorage.getItem("wallet"),account,isActive]);


    useMemo(() => {
        if (swapsAmount.from.amount > 0) {
            // const fromV = swaps.from.currentValue / swaps.from.currentQuantity * 10 ** swaps.from.decimals;
            // const toV = swaps.to.currentValue / swaps.to.currentQuantity * 10 ** swaps.to.decimals;
            // let limitPrice;
            // if (swaps.from.decimals < swaps.to.decimals || swaps.from.decimals === swaps.to.decimals) {
            //   const toVl = Math.floor(toV / fromV * (1 + 0.5 / 100));
            //   limitPrice = BigInt(toVl * 2 ** 128) + BigInt(1);
            //   // console.log(toVl, toV / fromV, 1, 22555522222222, limitPrice)
            // } else {
            //   const toVl = Math.floor(fromV / toV * (1 + 0.5 / 100));
            //   limitPrice = BigInt(1 * 2 ** 128) + BigInt(toVl);
            //   // console.log(1, toVl, fromV / toV, 22555522222222, limitPrice)
            // }
            // const a: BigInt = BigInt(Number(swapsAmount.from.amount) * 10 ** swaps.from.decimals);
            (async () => {
                // const signer = await provider.getSigner()
                // const contract = new ethers.Contract(contractAddress, MarketManager, signer);
                // await contract.methods.buyGood("", "", a, limitPrice.toString(), false).estimateGas();
                // const gasPrice = await contract.estimateGas['buyGood']("51649299683075463979090664991608549190737649190809275440655607745038800234274", "14700013424982216455688397208100595100161518504028027706369398309082945288267", a, limitPrice.toString(), false)
                const gasPrice = (await provider.getFeeData()).gasPrice?.toString(); // 获取 gas 价格
                // console.log(gasPrice, 88888)
                if (gasPrice)
                    setNetworkCost(ethers.formatEther(gasPrice));
            })();
        }
    }, [swaps, swapsAmount]);

    const balanceSel = async (address: string) => {
        if (account !== undefined || account !== "undefined")
            try {
                if (address === "0x0000000000000000000000000000000000000000") {
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

    // const balanceMap =
    useMemo(async () => {
        // console.log(account)
        if (isActive && account !== null) {
            const from = await balanceSel(swaps.from.address);
            const to = await balanceSel(swaps.to.address);
            console.log("swapsbalanceMap", from, to);
            setbalanceMap({ from: from, to: to });
            return { from: from, to: to }
        } else setbalanceMap({ from: 0, to: 0 }) //return { from: 0, to: 0 }
    }, [swaps, isActive]);


    // const balanceMap1 = 
    useMemo(async () => {
        if (isActive && account !== null) {
            const from = await balanceSel(invest.from.address);
            const to = await balanceSel(invest.to.address);
            console.log("investbalanceMap", from, to)
            setbalanceMap1({ from: from, to: to });
            return { from: from, to: to }
        } else setbalanceMap1({ from: 0, to: 0 }) // return { from: 0, to: 0 }
    }, [invest, isActive]);

    const disinvest = async (pid: number, qut: any) => {

        const signer = await provider.getSigner()
        const contract = new ethers.Contract(contractAddress, MarketManager, signer);

        console.log(pid, qut);
        return await contract.disinvestProof(pid, qut,account,"0x0000000000000000000000000000000000000000").then((transaction) => {
            console.log('Transaction sent:', transaction);
            return true;
            // return transaction.wait().then((receipt: any) => {
            //     console.log('Transaction mined:', receipt);
            //     return true;
            // }).catch((error: any) => {
            //     console.error('Error receipt:', error);
            //     return false;
            // });
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
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(contractAddress, MarketManager, signer);

            let decimals = 18;
            if (addr.length < 5) {
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
            if (addr.length < 5 || addr === "0x0000000000000000000000000000000000000000") {
                addr = "0x0000000000000000000000000000000000000000";
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
            } else if (addr === "0x0000000000000000000000000000000000000000" && goodVaddr === "0x0000000000000000000000000000000000000000") {
                initGoodV = tAmount + fAmount;
                initGoodVA = true;
                allowanceV = true;
                allowanceB = true;
            } else if (goodVaddr === "0x0000000000000000000000000000000000000000") {
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
                    return await contract.initGood(vgood, qunt, addr, config, { value: initGoodV }).then((transaction) => {
                        console.log('Transaction sent:', transaction);
                        return true;
                        // return transaction.wait().then((receipt: any) => {
                        //     console.log('Transaction mined:', receipt);
                        //     return true;
                        // }).catch((error: any) => {
                        //     console.error('Error receipt:', error);
                        //     return false;
                        // });
                    }).catch((error: any) => {
                        console.error('Error transaction:', error);
                        return false;
                    });
                } else {
                    return await contract.initGood(vgood, qunt, addr, config).then((transaction) => {
                        console.log('Transaction sent:', transaction);
                        return true;
                        // return transaction.wait().then((receipt: any) => {
                        //     console.log('Transaction mined:', receipt);
                        //     return true;
                        // }).catch((error: any) => {
                        //     console.error('Error receipt:', error);
                        //     return true;
                        // });
                    }).catch((error: any) => {
                        console.error('Error transaction:', error);
                        return false;
                    });
                }
            }

            // if (addr.length < 5 || goodVaddr === "0x0000000000000000000000000000000000000000") {
            //     addr = "0x0000000000000000000000000000000000000000";
            //     // console.log(vgood,qunt,addr,config)
            //     return await contractAllowV.allowance(account, contractAddress).then(async (allowance) => {
            //         console.log('AllowanceV:', allowance); // 以太单位转换为Ether字符串
            //         if (allowance > fAmount || allowance === fAmount) {
            //             await contract.initGood(vgood, qunt, addr, config, { value: BigInt(tAmount) }).then((transaction) => {
            //                 console.log('Transaction sent:', transaction);
            //                 transaction.wait().then((receipt: any) => {
            //                     console.log('Transaction mined:', receipt);
            //                     return true;
            //                 }).catch((error: any) => {
            //                     console.error('Error receipt:', error);
            //                     return false;
            //                 });
            //             }).catch((error: any) => {
            //                 console.error('Error transaction:', error);
            //                 return false;
            //             });
            //         } else {

            //             await contractF.approve(contractAddress, fAmount).then((transaction) => {
            //                 console.log('Transaction sent:', transaction);
            //                 transaction.wait().then(async (receipt: any) => {
            //                     console.log('Transaction mined:', receipt);
            //                     await contract.initGood(vgood, qunt, addr, config, { value: BigInt(tAmount) }).then((transaction) => {
            //                         console.log('Transaction sent:', transaction);
            //                         transaction.wait().then((receipt: any) => {
            //                             console.log('Transaction mined:', receipt);
            //                         }).catch((error: any) => {
            //                             console.error('Error receipt:', error);
            //                         });
            //                     }).catch((error: any) => {
            //                         console.error('Error transaction:', error);
            //                     });
            //                 }).catch((error: any) => {
            //                     console.error('Error receipt:', error);
            //                 });
            //             }).catch((error) => {
            //                 console.error('Error approve:', error);
            //             });
            //         }
            //     }).catch((error: any) => {
            //         console.error('Error receipt:', error);
            //         return false;
            //     });
            // } else if (ethers.isAddress(addr)) {
            //     const contractT = new ethers.Contract(addr, erc20, signer);

            //     const contractAllow = new ethers.Contract(addr, erc20, provider);

            //     return await contractAllowV.allowance(account, contractAddress).then(async (allowance) => {
            //         console.log('AllowanceV:', allowance); // 以太单位转换为Ether字符串
            //         if (allowance > fAmount || allowance === fAmount) {
            //             return await contractAllow.allowance(account, contractAddress).then(async (allowance) => {
            //                 console.log('Allowance:', allowance); // 以太单位转换为Ether字符串
            //                 if (allowance > tAmount || allowance === tAmount) {
            //                     return await contract.initGood(vgood, qunt, addr, config).then((transaction) => {
            //                         console.log('Transaction sent:', transaction);
            //                         return transaction.wait().then((receipt: any) => {
            //                             console.log('Transaction mined:', receipt);
            //                             return true;
            //                         }).catch((error: any) => {
            //                             console.error('Error receipt:', error);
            //                             return true;
            //                         });
            //                     }).catch((error: any) => {
            //                         console.error('Error transaction:', error);
            //                         return false;
            //                     });
            //                 } else {
            //                     return await contractT.approve(contractAddress, tAmount).then(async (transaction) => {
            //                         console.log('Transaction sent:', transaction);
            //                         return transaction.wait().then(async (receipt: any) => {
            //                             console.log('Transaction mined:', receipt);
            //                             return await contract.initGood(vgood, qunt, addr, config).then((transaction) => {
            //                                 console.log('Transaction sent:', transaction);
            //                                 return transaction.wait().then((receipt: any) => {
            //                                     console.log('Transaction mined:', receipt);
            //                                     return true;
            //                                 }).catch((error: any) => {
            //                                     console.error('Error receipt:', error);
            //                                     return true;
            //                                 });
            //                             }).catch((error: any) => {
            //                                 console.error('Error transaction:', error);
            //                                 return false;
            //                             });
            //                         }).catch((error: any) => {
            //                             console.error('Error receipt:', error);
            //                             return false;
            //                         });
            //                     }).catch((error) => {
            //                         console.error('Error:', error);
            //                         return false;
            //                     });
            //                 }
            //             }).catch((error) => {
            //                 console.error('Error fetching allowance:', error);
            //                 return false;
            //             });
            //         } else {
            //             return await contractF.approve(contractAddress, fAmount).then(async (transaction) => {
            //                 console.log('Transaction sent:', transaction);
            //                 return transaction.wait().then(async (receipt: any) => {
            //                     console.log('Transaction mined:', receipt);

            //                     return await contractT.approve(contractAddress, tAmount).then(async (transaction) => {
            //                         console.log('Transaction sent:', transaction);
            //                         return transaction.wait().then(async (receipt: any) => {
            //                             console.log('Transaction mined:', receipt);
            //                             return await contract.initGood(vgood, qunt, addr, config).then((transaction) => {
            //                                 console.log('Transaction sent:', transaction);
            //                                 return transaction.wait().then((receipt: any) => {
            //                                     console.log('Transaction mined:', receipt);
            //                                     return true;
            //                                 }).catch((error: any) => {
            //                                     console.error('Error receipt:', error);
            //                                     return true;
            //                                 });
            //                             }).catch((error: any) => {
            //                                 console.error('Error transaction:', error);
            //                                 return false;
            //                             });
            //                         }).catch((error: any) => {
            //                             console.error('Error receipt:', error);
            //                             return false;
            //                         });
            //                     }).catch((error) => {
            //                         console.error('Error:', error);
            //                         return false;
            //                     });
            //                 }).catch((error: any) => {
            //                     console.error('Error receipt:', error);
            //                     return false;
            //                 });
            //             }).catch((error) => {
            //                 // console.log(333)
            //                 // alert(0)
            //                 console.error('Error:', error);
            //                 return false;
            //             });
            //         }

            //     }).catch((error) => {
            //         console.error('Error fetching allowance:', error);
            //         return false;
            //     });
            // }

        } catch (error) {
            console.error('出错:', error);
            return false;
        }
    }

    const investGoods = async (invest: any, famount: any, tamount: any, isValueGood: boolean) => {

        // const contractAddress = '0x9d0108882640990941FbC5677C1D9e3281a4e74C'; // multicall 合约地址
        try {

            const signer = await provider.getSigner()
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
                if (invest.from.address === "0x0000000000000000000000000000000000000000") {
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
                if (invest.from.address === "0x0000000000000000000000000000000000000000") {
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
                } else if (invest.to.address === "0x0000000000000000000000000000000000000000") {
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

                } else if (invest.to.address === "0x0000000000000000000000000000000000000000" || invest.from.address === "0x0000000000000000000000000000000000000000") {
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
                        return await contract.investGood(invest.from.id, 0, famount, { value: investGoodV }).then((transaction) => {
                            console.log('Transaction sent:', transaction);
                            return true;
                            // return transaction.wait().then((receipt: any) => {
                            //     console.log('Transaction mined:', receipt);
                            //     return true;
                            // }).catch((error: any) => {
                            //     console.error('Error receipt:', error);
                            //     return false;
                            // });
                        }).catch((error: any) => {
                            console.error('Error transaction:', error);
                            return false;
                        });
                    } else {
                        return await contract.investGood(invest.from.id, 0, famount).then((transaction) => {
                            console.log('Transaction sent:', transaction);
                            return true;
                            // return transaction.wait().then((receipt: any) => {
                            //     console.log('Transaction mined:', receipt);
                            //     return true;
                            // }).catch((error: any) => {
                            //     console.error('Error receipt:', error);
                            //     return false;
                            // });
                        }).catch((error: any) => {
                            console.error('Error transaction:', error);
                            return false;
                        });
                    }
                } else {
                    if (investGoodVA) {
                        return await contract.investGood(invest.from.id, invest.to.id, famount, { value: investGoodV }).then((transaction) => {
                            console.log('Transaction sent:', transaction);
                            return true;
                            // return transaction.wait().then((receipt: any) => {
                            //     console.log('Transaction mined:', receipt);
                            //     return true;
                            // }).catch((error: any) => {
                            //     console.error('Error receipt:', error);
                            //     return false;
                            // });
                        }).catch((error: any) => {
                            console.error('Error transaction:', error);
                            return false;
                        });
                    } else {
                        return await contract.investGood(invest.from.id, invest.to.id, famount).then((transaction) => {
                            console.log('Transaction sent:', transaction);
                            return true;
                            // return transaction.wait().then((receipt: any) => {
                            //     console.log('Transaction mined:', receipt);
                            //     return true;
                            // }).catch((error: any) => {
                            //     console.error('Error receipt:', error);
                            //     return false;
                            // });
                        }).catch((error: any) => {
                            console.error('Error transaction:', error);
                            return false;
                        });
                    }

                }
            }
            // return;
            // if (isValueGood) {
            //     console.log(1)
            //     if (invest.from.address === "0x0000000000000000000000000000000000000000") {

            //         console.log(101)
            //         await contract.investGood(invest.from.id, 0, famount, { value: famount }).then((transaction) => {
            //             console.log('Transaction sent:', transaction);
            //             transaction.wait().then((receipt: any) => {
            //                 console.log('Transaction mined:', receipt);
            //             }).catch((error: any) => {
            //                 console.error('Error receipt:', error);
            //             });
            //         }).catch((error: any) => {
            //             console.error('Error transaction:', error);
            //         });
            //     } else {
            //         console.log(102)
            //         await contractF.approve(contractAddress, famount).then(async (transaction) => {

            //             console.log(1002)
            //             transaction.wait().then(async (receipt: any) => {
            //                 console.log(10002, invest.from.id, invest.to.id, famount)

            //                 await contract.investGood(invest.from.id, 0, famount).then((transaction) => {
            //                     console.log('Transaction sent:', transaction);
            //                     transaction.wait().then((receipt: any) => {
            //                         console.log('Transaction mined:', receipt);
            //                     }).catch((error: any) => {
            //                         console.error('Error receipt:', error);
            //                     });
            //                 }).catch((error: any) => {
            //                     console.error('Error transaction:', error);
            //                 });
            //             }).catch((error: any) => {
            //                 console.error('Error receipt:', error);
            //             });
            //         }).catch((error) => {
            //             console.error('Error:', error);
            //         });
            //     }
            // } else {
            //     console.log(2)
            //     if (invest.from.address === "0x0000000000000000000000000000000000000000") {
            //         console.log(201)

            //         await contractT.approve(contractAddress, tamount).then(async (transaction) => {

            //             transaction.wait().then(async (receipt: any) => {

            //                 await contract.investGood(invest.from.id, invest.to.id, famount).then((transaction) => {
            //                     console.log('Transaction sent:', transaction);
            //                     transaction.wait().then((receipt: any) => {
            //                         console.log('Transaction mined:', receipt);
            //                     }).catch((error: any) => {
            //                         console.error('Error receipt:', error);
            //                     });
            //                 }).catch((error: any) => {
            //                     console.error('Error transaction:', error);
            //                 });
            //             }).catch((error: any) => {
            //                 console.error('Error receipt:', error);
            //             });
            //         }).catch((error) => {
            //             console.error('Error:', error);
            //         });
            //     } else if (invest.to.address === "0x0000000000000000000000000000000000000000") {
            //         console.log(202)

            //         await contractF.approve(contractAddress, famount).then(async (transaction) => {

            //             transaction.wait().then(async (receipt: any) => {

            //                 await contract.investGood(invest.from.id, invest.to.id, famount).then((transaction) => {
            //                     console.log('Transaction sent:', transaction);
            //                     transaction.wait().then((receipt: any) => {
            //                         console.log('Transaction mined:', receipt);
            //                     }).catch((error: any) => {
            //                         console.error('Error receipt:', error);
            //                     });
            //                 }).catch((error: any) => {
            //                     console.error('Error transaction:', error);
            //                 });
            //             }).catch((error: any) => {
            //                 console.error('Error receipt:', error);
            //             });
            //         }).catch((error) => {
            //             console.error('Error:', error);
            //         });
            //     } else {
            //         console.log(203)
            //         await contractF.approve(contractAddress, famount).then(async (transaction) => {
            //             // console.log(2222)
            //             transaction.wait().then(async (receipt: any) => {
            //                 await contractT.approve(contractAddress, tamount).then(async (transaction) => {
            //                     transaction.wait().then(async (receipt: any) => {
            //                         await contract.investGood(invest.from.id, invest.to.id, famount).then((transaction) => {
            //                             console.log('Transaction sent:', transaction);
            //                             transaction.wait().then((receipt: any) => {
            //                                 console.log('Transaction mined:', receipt);
            //                             }).catch((error: any) => {
            //                                 console.error('Error receipt:', error);
            //                             });
            //                         }).catch((error: any) => {
            //                             console.error('Error transaction:', error);
            //                         });
            //                     }).catch((error: any) => {
            //                         console.error('Error receipt:', error);
            //                     });
            //                 }).catch((error) => {
            //                     console.error('Error:', error);
            //                 });
            //             }).catch((error: any) => {
            //                 console.error('Error receipt:', error);
            //             });
            //         }).catch((error) => {
            //             // alert(0)
            //             console.error('Error:', error);
            //         });
            //     }
            // }
            // return true;
        } catch (error) {
            console.error('Error receipt:', error);
            return false;
        };

    };

    // const approve = async (contract: any, account: string, mun: number) => {
    //   await contract.approve(account, mun).then((res: any) => {
    //     // console.log('Balances:', res); 
    //     return true;
    //   }).catch((error: any) => {
    //     // console.error('Error000:', error);
    //     return false;
    //   });
    // }

    const swapBuyGood = async (params: any, amount: any, address: string) => {
        try {

            console.log(1110, params,amount,address)
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(contractAddress, MarketManager, signer);


            if (address === "0x0000000000000000000000000000000000000000") {
                console.log(0, amount)
                return await contract.buyGood(params[0], params[1], params[2], params[3], params[4], { value: amount }).then((transaction) => {
                    console.log('Transaction sent:', transaction);
                    return true;
                    // return transaction.wait().then((receipt: any) => {
                    //     console.log('Transaction mined:', receipt);
                    //     return true;
                    // }).catch((error: any) => {
                    //     console.error('Error receipt:', error);
                    //     return false;
                    // });
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
                    return await contract.buyGood(params[0], params[1], params[2], params[3], params[4]).then((transaction) => {
                        console.log('buyGood Transaction sent:', transaction);
                        return true;
                        // return transaction.wait().then((receipt: any) => {
                        //     console.log('buyGood Transaction mined:', receipt);
                        //     return true;
                        // }).catch((error: any) => {
                        //     console.error('Error buyGood receipt:', error);
                        //     return false;
                        // });
                    }).catch((error: any) => {
                        console.error('Error buyGood transaction:', error);
                        return false;
                    });
                } else {
                    return await contractF.approve(contractAddress, amount).then(async (transaction) => {
                        console.log('approve Transaction sent:', transaction);
                        return transaction.wait().then(async (receipt: any) => {
                            console.log('approve Transaction mined:', receipt);
                            return await contract.buyGood(params[0], params[1], params[2], params[3], params[4]).then((transaction) => {
                                console.log('buyGood Transaction sent:', transaction);
                                return true;
                                // return transaction.wait().then((receipt: any) => {
                                //     console.log('buyGood Transaction mined:', receipt);
                                //     return true;
                                // }).catch((error: any) => {
                                //     console.error('Error buyGood receipt:', error);
                                //     return false;
                                // });
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
        newGoods, disinvest
    };
};

export default useWallet;

import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Form,
    Input,
    Select, Avatar, Spin, message, Button, Space
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import CreatModal from "./faucetModal";
import useFaucet from "@/hooks/useFaucet";
import { useLocalStorage } from "@/utils/LocalStorageManager";
import { useAccount } from 'wagmi';
import { getChainName } from '@/data/networks';
import { iconUrl } from '@/graphql/util';


const { Option } = Select;

const styles = {
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
    newButton: {
        // backgroundColor: "#10b981",
        width: "100%"
    },
    newButton1: {
        // backgroundColor: "#10b981",
        width: "100%",
        color: "#fff"
    }
} as const;

interface Props {
    // setDataNum: (value: number) => void;
}

export const Faucet = ({ }: Props) => {
    const { isConnected, address } = useAccount();
    const [spinning, setSpinning] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [open, setOpen] = useState(false);
    const [goodC, setGoodC] = useState("");
    const [goodV, setGoodV] = useState("");
    const [goodVAddr, setGoodVAddr] = useState("");
    const [decimals, setDecimals] = useState(0);
    const [selectVgood, setSelectVgood] = useState([]);
    // @ts-ignore
    const { ssionChian } = useLocalStorage();
    const { t } = useTranslation();

    const { faucetTestCion } = useFaucet();
    const [form] = Form.useForm();
    const chainName = getChainName(ssionChian);
    const testCion: any = {
        11155111: [{
            id: "0xA35e43E7a5839b31624dad3f35dA63875E705934", symbol: "USDT", decimals: 6, address: "0xA35e43E7a5839b31624dad3f35dA63875E705934"
        }, {
            id: "0xCC1f68861f8a63b5aa837A41087C17Bc5f64521d", symbol: "WBTC", decimals: 8, address: "0xCC1f68861f8a63b5aa837A41087C17Bc5f64521d"
        }, {
            id: "0xE5Dbe53f4e408b9C53472226bC01faC57E40D0B3", symbol: "WETH", decimals: 18, address: "0xE5Dbe53f4e408b9C53472226bC01faC57E40D0B3"
        }, {
            id: "0x9503071bC3F2a85C0BbaC186172782E7b7FF24F7", symbol: "USDC", decimals: 6, address: "0x9503071bC3F2a85C0BbaC186172782E7b7FF24F7"
        }, {
            id: "0xD20F79BF90d72409bb2281524aEeBc3a367F15dD", symbol: "BNB", decimals: 18, address: "0xD20F79BF90d72409bb2281524aEeBc3a367F15dD"
        }, {
            id: "0x8800242930D425332dD34856BbE5b3a1674b0adC", symbol: "DAI", decimals: 18, address: "0x8800242930D425332dD34856BbE5b3a1674b0adC"
        }, {
            id: "0x91DE907De4a2c586f98E010E433C030288A5436c", symbol: "TON", decimals: 9, address: "0x91DE907De4a2c586f98E010E433C030288A5436c"
        }, {
            id: "0x375FdcE5556730730770Efa157C85930768AF4E2", symbol: "SHIB", decimals: 18, address: "0x375FdcE5556730730770Efa157C85930768AF4E2"
        }, {
            id: "0x60a65585857F14Ed6DB3cAC3C0b8213a8298d9Fd", symbol: "LINK", decimals: 18, address: "0x60a65585857F14Ed6DB3cAC3C0b8213a8298d9Fd"
        }, {
            id: "0xf2f123eB8599E6C27F774c4ab50EfE4Dcb7f6483", symbol: "LEO", decimals: 18, address: "0xf2f123eB8599E6C27F774c4ab50EfE4Dcb7f6483"
        }, {
            id: "0xdBcBE09B177AcB83e21255943b4a19341C0B0d16", symbol: "NEAR", decimals: 24, address: "0xdBcBE09B177AcB83e21255943b4a19341C0B0d16"
        }, {
            id: "0x6CC0A493FE6b86500D49CBf7e89fCE4d6ee23377", symbol: "OKB", decimals: 18, address: "0x6CC0A493FE6b86500D49CBf7e89fCE4d6ee23377"
        }, {
            id: "0xA0912Fc81E0Be43DfC16Af2d3999C503745e3011", symbol: "UNI", decimals: 18, address: "0xA0912Fc81E0Be43DfC16Af2d3999C503745e3011"
        }, {
            id: "0x7771FFE143eeD2d0a612A4b37Ab96c0d82c48bf3", symbol: "ARB", decimals: 18, address: "0x7771FFE143eeD2d0a612A4b37Ab96c0d82c48bf3"
        }, {
            id: "0x9989dED344CB231C6a3BE58f253122f9303fE7eC", symbol: "GRT", decimals: 18, address: "0x9989dED344CB231C6a3BE58f253122f9303fE7eC"
        }, {
            id: "0x7aff8befc7cbe268d90d7248035133881526734b", symbol: "MKR", decimals: 18, address: "0x7aff8befc7cbe268d90d7248035133881526734b"
        }
        // , {
        //     id: "0x711B27D526Eb688c0D509014E413f993C463D39e", symbol: "ADA", decimals: 18, address: "0x711B27D526Eb688c0D509014E413f993C463D39e"
        // }, {
        //     id: "0xe9f08e8D860b96Cdd5dd8fDCCBF5bBA764873ed4", symbol: "SOL", decimals: 18, address: "0xe9f08e8D860b96Cdd5dd8fDCCBF5bBA764873ed4"
        // }
    ],
        97: [{
            id: "0xD83d10d21ed402653B69dFe47187E3a9192F187E", symbol: "USDT", decimals: 6, address: "0xD83d10d21ed402653B69dFe47187E3a9192F187E"
        }, {
            id: "0xbc7EB48dD5220BC4EB8e1BD11D7ba45Eb6Ee368A", symbol: "WBTC", decimals: 8, address: "0xbc7EB48dD5220BC4EB8e1BD11D7ba45Eb6Ee368A"
        }, {
            id: "0x0674E4Df85987c4FC317757ec9942e099F7E5118", symbol: "WETH", decimals: 18, address: "0x0674E4Df85987c4FC317757ec9942e099F7E5118"
        }],
        5003: [{
            id: "0x875A9522d695804e1F1636eE3616E6185F74b563", symbol: "USDT", decimals: 6, address: "0x875A9522d695804e1F1636eE3616E6185F74b563"
        }, {
            id: "0xa50eb0d081E986c280efF32dae089939Ea07bd22", symbol: "WBTC", decimals: 8, address: "0xa50eb0d081E986c280efF32dae089939Ea07bd22"
        }, {
            id: "0xCaFBbAd55eb09efe7bec8408Cff9932Be7D9A7fA", symbol: "WETH", decimals: 18, address: "0xCaFBbAd55eb09efe7bec8408Cff9932Be7D9A7fA"
        }],
        560048: [{
            id: "0x9588F74Df5BbC1CD3a45720Cb944A4b1048A4450", symbol: "USDT", decimals: 6, address: "0x9588F74Df5BbC1CD3a45720Cb944A4b1048A4450"
        }, {
            id: "0x11E10725a6Fc7C47833209C6DE31307Fbd389494", symbol: "WBTC", decimals: 8, address: "0x11E10725a6Fc7C47833209C6DE31307Fbd389494"
        }, {
            id: "0x2387fD72C1DA19f6486B843F5da562679FbB4057", symbol: "WETH", decimals: 18, address: "0x2387fD72C1DA19f6486B843F5da562679FbB4057"
        }, {
            id: "0x875A9522d695804e1F1636eE3616E6185F74b563", symbol: "TWETH", decimals: 18, address: "0x875A9522d695804e1F1636eE3616E6185F74b563"
        }, {
            id: "0xCaFBbAd55eb09efe7bec8408Cff9932Be7D9A7fA", symbol: "DAI", decimals: 18, address: "0xCaFBbAd55eb09efe7bec8408Cff9932Be7D9A7fA"
        }, {
            id: "0xe20aC55EbFD0FFE2e99e667252703300B2A1062f", symbol: "USDC", decimals: 6, address: "0xe20aC55EbFD0FFE2e99e667252703300B2A1062f"
        }, {
            id: "0x681bb0286E2A0e967107aB414FC8F5a200b76E2e", symbol: "BNB", decimals: 18, address: "0x681bb0286E2A0e967107aB414FC8F5a200b76E2e"
        }, {
            id: "0x8A84fEd4f7B46Dd2513208dda18ee2BAD2669485", symbol: "TON", decimals: 9, address: "0x8A84fEd4f7B46Dd2513208dda18ee2BAD2669485"
        }, {
            id: "0xC9aFfC5d4a3fEd4874fA4B19e640034Fa26Ca838", symbol: "SHIB", decimals: 18, address: "0xC9aFfC5d4a3fEd4874fA4B19e640034Fa26Ca838"
        }, {
            id: "0x57a54f038475140Acf3FD421B572f5f493525f63", symbol: "LINK", decimals: 18, address: "0x57a54f038475140Acf3FD421B572f5f493525f63"
        }, {
            id: "0xAC9cE854B7e76f505D1E46d8FedfB1d99170061E", symbol: "LEO", decimals: 18, address: "0xAC9cE854B7e76f505D1E46d8FedfB1d99170061E"
        }, {
            id: "0x32A908f3c1526BDc60e1038C48DE6CE72f42dd1B", symbol: "NEAR", decimals: 24, address: "0x32A908f3c1526BDc60e1038C48DE6CE72f42dd1B"
        }, {
            id: "0xe764993f88bfe473E8fdc8E21340f1D497dCC3a8", symbol: "OKB", decimals: 18, address: "0xe764993f88bfe473E8fdc8E21340f1D497dCC3a8"
        }, {
            id: "0x52De3a4FE5Fb33aC148684D68693B949bBAea9b7", symbol: "UNI", decimals: 18, address: "0x52De3a4FE5Fb33aC148684D68693B949bBAea9b7"
        }, {
            id: "0x70811486fe60C115751a7dc924ea15f91D7fBA8c", symbol: "ARB", decimals: 18, address: "0x70811486fe60C115751a7dc924ea15f91D7fBA8c"
        }, {
            id: "0xDd790f5F3b6f86f25177B16408eBd35b2b4b2a71", symbol: "GRT", decimals: 18, address: "0xDd790f5F3b6f86f25177B16408eBd35b2b4b2a71"
        }, {
            id: "0xd9A2171a77694b7622f0B0C6161269Aa6D0B04dF", symbol: "MKR", decimals: 18, address: "0xd9A2171a77694b7622f0B0C6161269Aa6D0B04dF"
        }],
    };

    useEffect(() => {
        try {
            // console.log(ssionChian, 99)
            setGoodV(testCion[ssionChian][0].id);
            setGoodVAddr(testCion[ssionChian][0].address);
            setSelectVgood(testCion[ssionChian]);
        } catch { }
    }, [ssionChian]);

    useMemo(() => {
        try {
            // console.log(ssionChian, 991)
            setGoodC("");
            setGoodV(testCion[ssionChian][0].id);
            setGoodVAddr(testCion[ssionChian][0].address);
        } catch { }
    }, [open, ssionChian]);

    const isDisabled = useMemo(() => {
        // @ts-ignore
        if (goodC === "")
            return true;
        return false;
    }, [goodC])
    const selectAfter = (
        <Select
            style={{ width: 100 }}
            placeholder="Choose Test Coin"
            optionLabelProp="label"
            value={goodV}
            onChange={(e) => {
                // @ts-ignore
                const op: any = selectVgood.find(option => option.id === e)
                setGoodV(e);
                setDecimals(op.decimals);
                setGoodVAddr(op.address);
            }}
        >
            {selectVgood.map(item => (
                // @ts-ignore
                <Option key={item.id} value={item.id} label={item.symbol}>
                    <div>
                        <Avatar size="small" src={
                            // @ts-ignore
                            <img src={iconUrl(chainName, item.address) ?? "/token.svg"} alt="avatar" onError={(e) => {
                                e.currentTarget.src =
                                    "/token.svg";
                            }} />}>
                        </Avatar>{" "}
                        {
                            // @ts-ignore
                            item.symbol}
                    </div>
                </Option>
            ))}
        </Select>
    );

    const Obtain = async () => {
        if (isConnected) {
            setSpinning(true);
            // console.log(goodC, goodVAddr)
            const isSuccess = await faucetTestCion(goodC, goodVAddr, address,decimals);

            // console.log("isSuccess:", isSuccess)
            if (isSuccess) {
                messageApi.open({
                    type: 'success',
                    content: 'Receive success',
                });
                setOpen(false);
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Receive fail',
                });
            }
            setSpinning(false);
            document.body.style.overflow = "";
        }
    };

    function mess() {
        messageApi.open({
            type: 'success',
            content: 'Success Copy',
        });
    }

    function CopyC() {

        if (navigator.clipboard) {
            // 使用 clipboard API 复制文本
            navigator.clipboard.writeText(goodVAddr);
            mess();
            // alert('文本已复制到剪贴板');
        } else {
            // 如果不支持，可以提供一个回退方案，比如使用 prompt 或者 textarea + document.execCommand('copy')（但请注意，execCommand 已被弃用）
            const textarea = document.createElement('textarea');
            textarea.style.position = 'fixed'; // 防止滚动条
            textarea.style.top = '0';
            textarea.style.left = '0';
            textarea.style.opacity = '0';
            textarea.value = goodVAddr;
            document.body.appendChild(textarea);

            try {
                // 尝试复制文本
                textarea.select();
                document.execCommand('copy');
                // alert('文本已复制到剪贴板（回退方案）');
            } catch (err) {
                // console.error('复制文本时出错（回退方案）:', err);
                // alert('复制文本时出错，请尝试手动复制');
            }

            document.body.removeChild(textarea);
            mess();
            // alert('浏览器不支持 clipboard API');
        }
    }

    return (
        <>
            {contextHolder}
            <Button shape="round" type="primary" style={styles.button} onClick={() => {
                setOpen(true)
            }}>
                {t('header.menu.faucet')}
            </Button>
            <CreatModal open={open} setOpen={setOpen} title={t('header.menu.faucet.title')}>

                <Spin spinning={spinning} fullscreen indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} size="large" />

                <div >
                    <Form form={form} colon={false}>
                        <h2>{t('header.menu.faucet.amount')}</h2>
                        <Form.Item>
                            <Input
                                placeholder={t('header.menu.faucet.amounttip')}
                                type='number'
                                onChange={(e) => { setGoodC(e.target.value); }}
                                value={goodC}
                                addonAfter={selectAfter}
                            />
                        </Form.Item>
                        <h2>{t('header.menu.faucet.contract')}</h2>
                        <Form.Item>
                            <Space.Compact style={{ width: '100%' }}>
                                <Input
                                    onChange={(e) => { setGoodC(e.target.value); }}
                                    value={goodVAddr}
                                    disabled
                                />
                                <Button
                                    type="primary"
                                    // style={{ backgroundColor: "#10b981", color: "#fff" }}
                                    onClick={CopyC}
                                >{t('header.menu.faucet.copy')}</Button>
                            </Space.Compact>
                        </Form.Item>

                    </Form>
                    <Button
                        type="primary"
                        style={isDisabled ? styles.newButton : styles.newButton1}
                        disabled={isDisabled}
                        onClick={Obtain}
                    >{t('header.menu.faucet.obtain')}</Button>
                </div>
                <div className='flex justify-between py-8'>
                    <a href='https://hoodi-faucet.pk910.de' className='w-full' target='_bank'>
                        <Button
                            type="primary"
                            style={styles.newButton1}
                        >{t('header.menu.faucet.testeth')}</Button>
                    </a>
                    {/* <a href='https://www.alchemy.com/faucets/ethereum-sepolia' className='w-full' target='_bank'>
                        <Button
                            type="primary"
                            style={styles.newButton1}
                        >{t('header.menu.faucet.testeth')}</Button>
                    </a> */}
                    {/* <a href='https://docs.mantle.xyz/network/for-uers/how-to-guides/fetching-test-tokens#faucets' className='w-full' target='_bank'>
                        <Button
                            type="primary"
                            style={styles.newButton1}
                        >{t('header.menu.faucet.testmnt')}</Button>
                    </a> */}
                </div>
            </CreatModal>
        </>
    );
};
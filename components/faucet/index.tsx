import React, { useState, useMemo, useEffect } from 'react';
import {
    Form,
    Input,
    Select, Avatar, Spin, message, Button, Space
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import CreatModal from "./faucetModal";
import useFaucet from "@/hooks/useFaucet";
import { useWalletAddress } from "@/stores/walletAddress";
import { useLocalStorage } from "@/utils/LocalStorageManager";


const { Option } = Select;

const styles = {
    button: {
        height: "40px",
        padding: "0 20px",
        textAlign: "center",
        fontWeight: "600",
        letterSpacing: "0.2px",
        fontSize: "15px",
        margin: "20px 20px",
        border: "none"
    },
    newButton: {
        // backgroundColor: "#10b981",
        width: "100%"
    },
    newButton1: {
        backgroundColor: "#10b981",
        width: "100%",
        color: "#fff"
    }
} as const;

interface Props {
    // setDataNum: (value: number) => void;
}

export const Faucet = ({ }: Props) => {
    const [spinning, setSpinning] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [open, setOpen] = useState(false);
    const [goodC, setGoodC] = useState("");
    const [goodV, setGoodV] = useState("");
    const [goodVAddr, setGoodVAddr] = useState("");
    const [selectVgood, setSelectVgood] = useState([]);
    const { address } = useWalletAddress();
    // @ts-ignore
    const { ssionChian } = useLocalStorage();

    const { faucetTestCion } = useFaucet();
    const [form] = Form.useForm();
    const testCion1: any = [
        {
            id: "0xA35e43E7a5839b31624dad3f35dA63875E705934", symbol: "USDT", logo_url: "", address: "0xA35e43E7a5839b31624dad3f35dA63875E705934"
        }, {
            id: "0xCC1f68861f8a63b5aa837A41087C17Bc5f64521d", symbol: "WBTC", logo_url: "", address: "0xCC1f68861f8a63b5aa837A41087C17Bc5f64521d"
        }, {
            id: "0xE5Dbe53f4e408b9C53472226bC01faC57E40D0B3", symbol: "WETH", logo_url: "", address: "0xE5Dbe53f4e408b9C53472226bC01faC57E40D0B3"
        },
    ];
    const testCion: any = {
        11155111: [{
            id: "0xA35e43E7a5839b31624dad3f35dA63875E705934", symbol: "USDT", logo_url: "", address: "0xA35e43E7a5839b31624dad3f35dA63875E705934"
        }, {
            id: "0xCC1f68861f8a63b5aa837A41087C17Bc5f64521d", symbol: "WBTC", logo_url: "", address: "0xCC1f68861f8a63b5aa837A41087C17Bc5f64521d"
        }, {
            id: "0xE5Dbe53f4e408b9C53472226bC01faC57E40D0B3", symbol: "WETH", logo_url: "", address: "0xE5Dbe53f4e408b9C53472226bC01faC57E40D0B3"
        }],
        97: [{
            id: "0x11E10725a6Fc7C47833209C6DE31307Fbd389494", symbol: "USDT", logo_url: "", address: "0x11E10725a6Fc7C47833209C6DE31307Fbd389494"
        }, {
            id: "0x875A9522d695804e1F1636eE3616E6185F74b563", symbol: "WBTC", logo_url: "", address: "0x875A9522d695804e1F1636eE3616E6185F74b563"
        }, {
            id: "0x9588F74Df5BbC1CD3a45720Cb944A4b1048A4450", symbol: "WBNB", logo_url: "", address: "0x9588F74Df5BbC1CD3a45720Cb944A4b1048A4450"
        }]
    };

    useEffect(() => {
        try {
            console.log(ssionChian, 99)
            setGoodV(testCion[ssionChian][0].id);
            setGoodVAddr(testCion[ssionChian][0].address);
            setSelectVgood(testCion[ssionChian]);
        } catch { }
    }, [ssionChian]);

    useMemo(() => {
        try {
            console.log(ssionChian, 991)
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
                setGoodVAddr(op.address);
            }}
        >
            {selectVgood.map(item => (
                // @ts-ignore
                <Option key={item.id} value={item.id} label={item.symbol}>
                    <div>
                        <Avatar size="small" src={
                            // @ts-ignore
                            <img src={item.logo_url ?? "/token.svg"} alt="avatar" onError={(e) => {
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
        setSpinning(true);
        console.log(goodC, goodVAddr)
        const isSuccess = await faucetTestCion(goodC, goodVAddr, address);

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
                TTSWAP FAUCET
            </Button>
            <CreatModal open={open} setOpen={setOpen} title={"TTSWAP FAUCET"}>

                <Spin spinning={spinning} fullscreen indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} size="large" />

                <div >
                    <Form form={form} colon={false}>
                        <h2>Test Cion Amount</h2>
                        <Form.Item>
                            <Input
                                placeholder="Enter Test Cion Amount"
                                type='number'
                                onChange={(e) => { setGoodC(e.target.value); }}
                                value={goodC}
                                addonAfter={selectAfter}
                            />
                        </Form.Item>
                        <h2>Test Cion Contract</h2>
                        <Form.Item>
                            <Space.Compact style={{ width: '100%' }}>
                                <Input
                                    onChange={(e) => { setGoodC(e.target.value); }}
                                    value={goodVAddr}
                                    disabled
                                />
                                <Button
                                    type="primary"
                                    style={{ backgroundColor: "#10b981", color: "#fff" }}
                                    onClick={CopyC}
                                >Copy</Button>
                            </Space.Compact>
                        </Form.Item>

                    </Form>
                    <Button
                        type="primary"
                        style={isDisabled ? styles.newButton : styles.newButton1}
                        disabled={isDisabled}
                        onClick={Obtain}
                    >Obtain Test Coin</Button>
                </div>
                <div className='flex justify-between py-8'>
                    <a href='https://www.alchemy.com/faucets/ethereum-sepolia' className='w-full mr-4' target='_bank'>
                        <Button
                            type="primary"
                            style={styles.newButton1}
                        >Sepolia Test ETH</Button>
                    </a>
                    <a href='https://www.bnbchain.org/en/testnet-faucet' className='w-full' target='_bank'>
                        <Button
                            type="primary"
                            style={styles.newButton1}
                        >BSC Test BNB</Button>
                    </a>
                </div>
            </CreatModal>
        </>
    );
};
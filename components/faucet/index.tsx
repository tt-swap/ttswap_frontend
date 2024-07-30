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

    const { faucetTestCion } = useFaucet();
    const [form] = Form.useForm();
    const testCion: any = [
        {
            id: "0xA35e43E7a5839b31624dad3f35dA63875E705934", symbol: "USDT", logo_url: "", address: "0xA35e43E7a5839b31624dad3f35dA63875E705934"
        }, {
            id: "0xCC1f68861f8a63b5aa837A41087C17Bc5f64521d", symbol: "WBTC", logo_url: "", address: "0xCC1f68861f8a63b5aa837A41087C17Bc5f64521d"
        }, {
            id: "0xE5Dbe53f4e408b9C53472226bC01faC57E40D0B3", symbol: "WETH", logo_url: "", address: "0xE5Dbe53f4e408b9C53472226bC01faC57E40D0B3"
        },
    ];

    useEffect(() => {
        // (async () => {
        // let tokens: any = await GoodsDatas();
        // console.log(tokens, 99)
        setGoodV(testCion[0].id);
        setGoodVAddr(testCion[0].address);
        setSelectVgood(testCion);
        // })();
    }, []);

    useMemo(() => {
        setGoodC("");
        setGoodV(testCion[0].id);
        setGoodVAddr(testCion[0].address);
    }, [open]);

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
            </CreatModal>
        </>
    );
};
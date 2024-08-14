import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { TokenPayload, SwapTokenValue } from "@/shared/types/token";
import { useMemo, useState } from "react";
import { useSwapStore } from "@/stores/swap";

import TokenSwapModal from "./TokenSwapModal";
// import ImgCache from "./components/common/ImgCache";
// import ChainSelector from "@/components/ChainSelector";

import { SearchOutlined, DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Input, Button, Tree, Spin, Flex } from 'antd';
import type { GetProps, TreeDataNode } from 'antd';
import { useValueGood } from "@/stores/valueGood";


import {useLocalStorage} from "@/utils/LocalStorageManager";
import { prettifyCurrencys,Timestamp } from '@/graphql/util';
import { GoodsDatas } from '@/graphql/swap/index';

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

interface Props {
    value: TokenPayload;
    onChange: (value: SwapTokenValue) => void;
}

type LocalCurrency = Partial<SwapTokenValue>;
const TokenSwapSelector = ({ value, onChange }: Props) => {
    const [open, setOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [availableTokens, setTokensValue] = useState<Array<LocalCurrency>>([]);
    const [treeData, setTokens] = useState<TreeDataNode[]>();
    const { swaps } = useSwapStore();
    const { info } = useValueGood();
    const [spinning, setSpinning] = useState(false);
    const [addS, setAddS] = useState(0);
    // @ts-ignore
    const { ssionChian  } = useLocalStorage();

    useMemo(() => {
        setSpinning(true);
        console.log(addS);
        (async () => {
            let a: any = await GoodsDatas({
                id: info.id,
                sel: keyword,
                par: Timestamp()
            },ssionChian);
            let rest: Array<LocalCurrency> = a.tokenValue;
            // console.log(a,33332)
            setTokensValue(rest);
            a.tokens.map((el: any, index: number) => {
                a.tokens[index].key = el.id;
                a.tokens[index].title = (
                    <>
                        <img src={el.logo_url ?? "/token.svg"} alt="folder" className="treeImg"
                            onError={(e) => {
                                e.currentTarget.src =
                                    "/token.svg";
                            }} />
                        <span>
                            <span>{el.name}</span><br />
                            <span className="text-xs">{el.symbol}</span>
                        </span>
                    </>);
                el.children.map((el1: any, index1: number) => {
                    a.tokens[index].children[index1].key = el1.id;
                    a.tokens[index].children[index1].nodePd = true;
                    a.tokens[index].children[index1].title = (
                        <>
                            <img src={el1.logo_url ?? "/token.svg"} alt="folder" className="treeImg"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "/token.svg";
                                }} />
                            <span className="whitespace-nowrap">
                                <span>{el1.name}</span><br />
                                <span className="text-xs">{el1.symbol}</span>
                            </span>
                            <Flex className="magL" gap="4px 0" wrap>
                                <span>
                                    <span>Price:{prettifyCurrencys(el1.price)}{" "+info.symbol}</span>
                                    <span>Quantity:{prettifyCurrencys(el1.currentQuantity / 10 ** el1.decimals)}</span>
                                </span>
                                <span>
                                    <span>BuyFee:{(el1.buyFee * 100).toFixed(2)}%</span>
                                    <span>SellFee:{(el1.sellFee * 100).toFixed(2)}%</span></span>
                            </Flex>
                        </>);

                })
            })
            setTokens(a.tokens);
            setSpinning(false);
        })()
    }, [info, keyword,addS,ssionChian]);
    // console.log(availableTokens,222)
    const isDefault = value.symbol === DEFAULT_TOKEN;

    const showModal = (el: SwapTokenValue) => {
        setOpen(false);
        onChange(el);
        document.body.style.overflow = "";
        console.log(222, el)
    };

    // const onSearch = (value: string) => {
    //     console.log('search:', value);
    // };

    // useEffect(() => {
    //   Modal.setAppElement("body");
    //   const input: HTMLInputElement | null = document.querySelector('input');
    //   if (input) {
    //     input.focus();
    //   }
    // }, []);

    const onSelect: DirectoryTreeProps['onSelect'] = (keys: any, info: any) => {
        // console.log('Trigger Select', keys);
        if (info.node.nodePd) {
            setOpen(false);
            onChange(info.node);
            document.body.style.overflow = "";
            console.log('Trigger Select', swaps, keys, info);
        }
    };
    const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
        console.log('Trigger Expand', keys, info);
    };

    const handleClose = (a: boolean, b: string) => {
        setAddS(addS+1);
        setOpen(a);
        document.body.style.overflow = b;
    };
    return (
        <>
            <TokenSwapModal open={open} setOpen={setOpen} title={"Select Goods"}>
                <div className="select-head " >
                    <div className="sel-token">
                        <Input
                            autoFocus
                            placeholder="Search name or paste address"
                            prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            onChange={(e: any) => setKeyword(e.target.value)}
                            value={keyword}
                        />
                        {/* <ChainSelector /> */}
                    </div>
                    <div className="flex sel-token flexWap">
                        {availableTokens.map((el: any) => (
                            <div
                                onClick={() => showModal(el)}
                                key={el.id}
                                className="flex row cursor-pointer butSty but-hov"
                            >
                                <img alt="icon"
                                    className="w-6"
                                    // src={"/token.png"}
                                    src={value.logo_url ?? "/token.svg"}
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "/token.svg";
                                    }}
                                />
                                <span className="text-lg block">{el.symbol}</span>
                            </div>
                        ))}
                    </div>
                </div >
                <div className="divider" />
                <div style={{ paddingTop: "10px" }}>
                    {spinning ? (
                        <div style={{ padding: "40px", justifyContent: "center", display: "flex" }}>
                            <Spin spinning={spinning} indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                        </div>
                    ) : (
                        <DirectoryTree
                            showIcon={false}
                            switcherIcon={<DownOutlined />}
                            height={492}
                            onSelect={onSelect}
                            treeData={treeData}
                        />
                    )}
                </div>
            </TokenSwapModal>

            <div
                className=""
            >
                <Button
                    className="butSty cursor-pointer but-hov"
                    onClick={() => handleClose(true, "hidden")}
                    icon={<DownOutlined />}
                    iconPosition={"end"}
                >
                    <span className="text-lg block">{value.symbol}</span>
                    {!isDefault && (
                        <img
                            alt="icon"
                            className="w-6"
                            src={value.logo_url ?? "/token.svg"}
                            onError={(e) => {
                                e.currentTarget.src =
                                    "/token.svg";
                            }}
                        />
                    )}
                </Button>
            </div>
        </>
    );
};

export default TokenSwapSelector;

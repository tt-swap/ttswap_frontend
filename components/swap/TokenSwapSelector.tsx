import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { TokenPayload, SwapTokenValue } from "@/shared/types/token";
import { useMemo, useState,useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useSwapStore } from "@/stores/swap";

import TokenSwapModal from "./TokenSwapModal";
// import ImgCache from "./components/common/ImgCache";
// import ChainSelector from "@/components/ChainSelector";

import { SearchOutlined, DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Input, Button, Tree, Spin, Flex } from 'antd';
import type { GetProps, TreeDataNode } from 'antd';
import { useValueGood } from "@/stores/valueGood";


import { useLocalStorage } from "@/utils/LocalStorageManager";
import { prettifyCurrencys, Timestamp } from '@/graphql/util';
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
    const { ssionChian } = useLocalStorage();
    const { t } = useTranslation();

    useEffect(() => {
        setSpinning(true);
        console.log(addS);
        (async () => {
            let a: any = await GoodsDatas({
                id: info.id,
                sel: keyword,
                gid: "",
                par: Timestamp()
            }, ssionChian);
            let rest: Array<LocalCurrency> = a.tokenValue;
            console.log(a,33332)
            setTokensValue(rest);
            a.tokens.map((el: any, index: number) => {
                a.tokens[index].key = el.id;
                a.tokens[index].title = (
                    <>
                        <div className="flex justify-between gap-3">
                            <div className="flex items-center">
                                <img src={el.logo_url ?? "/token.svg"} alt="folder" className="treeImg"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "/token.svg";
                                    }} />
                                <span className="whitespace-nowrap">
                                    <div>{el.name}</div>
                                    <div className="text-xs font-color-1">{el.symbol}</div>
                                </span>
                            </div>
                            <Flex className="goods-indexs  gap-2 justify-between">
                                <div>
                                    <div>{t('body.swap.goods.price')}:{prettifyCurrencys(el.price)}{" " + info.symbol}</div>
                                    <div>{t('body.swap.goods.volume')}:{prettifyCurrencys(el.currentQuantity / 10 ** el.decimals)}</div>
                                </div>
                                <div>
                                    <div>{t('body.swap.goods.buyfee')}:{(el.buyFee * 100).toFixed(2)}%</div>
                                    <div>{t('body.swap.goods.sellfee')}:{(el.sellFee * 100).toFixed(2)}%</div></div>
                            </Flex>
                        </div>
                    </>);
            })
            setTokens(a.tokens);
            setSpinning(false);
        })()
    }, [info, keyword, addS, ssionChian]);
    // console.log(availableTokens,222)
    const isDefault = value.symbol === DEFAULT_TOKEN;

    const showModal = (el: SwapTokenValue) => {
        setOpen(false);
        onChange(el);
        document.body.style.overflow = "";
        console.log(222, el)
    };

    const onSelect: DirectoryTreeProps['onSelect'] = (keys: any, info: any) => {
        // console.log('Trigger Select', keys);
        // if (info.node.nodePd) {
            setOpen(false);
            onChange(info.node);
            document.body.style.overflow = "";
            console.log('Trigger Select', swaps, keys, info);
        // }
    };
    const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
        console.log('Trigger Expand', keys, info);
    };

    const handleClose = (a: boolean, b: string) => {
        setAddS(addS + 1);
        setOpen(a);
        document.body.style.overflow = b;
    };
    return (
        <>
            <TokenSwapModal open={open} setOpen={setOpen} title={t('body.swap.goods.title')}>
                <div className="select-head " >
                    <div className="sel-token">
                        <Input
                            autoFocus
                            placeholder={t('body.swap.goods.input')}
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
                                    src={el.logo_url ?? "/token.svg"}
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
                    <span className="text-lg block">{value.symbol==="Select Goods"?t('body.swap.goods.title'):value.symbol}</span>
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

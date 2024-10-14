import { DEFAULT_TOKEN } from "@/shared/constants/common";
import { InvestToken, InvestTokenValue } from "@/shared/types/token";
import { useMemo, useState } from "react";
import { useTranslation } from 'react-i18next';
import { calculateFeePercentage } from "@/utils/functions/calculate-fees-percentage";
// @ts-ignore
// import Modal from "react-modal";
import TokenInvestModal from "./TokenInvestModal";
import { useValueGood } from "@/stores/valueGood";

import { SearchOutlined, DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { Input, Select, Button, Tree, Spin, Flex } from 'antd';
import type { TreeProps, TreeDataNode } from 'antd';
import { useLocalStorage } from "@/utils/LocalStorageManager";

import { prettifyCurrencys } from '@/graphql/util';
import { GoodsDatas } from '@/graphql/invest';

const { Option } = Select;


// type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;

const { DirectoryTree } = Tree;

interface Props {
    value: InvestToken;
    isValue: boolean;
    onChange: (value: InvestTokenValue) => void;
}

type LocalCurrency = Partial<InvestTokenValue>;
const TokenInvestSelector = ({ value, onChange, isValue }: Props) => {
    const [open, setOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [availableTokens, setTokensValue] = useState<Array<LocalCurrency>>([]);
    const [treeData, setTokens] = useState<TreeDataNode[]>();
    const { info } = useValueGood();
    const [spinning, setSpinning] = useState(false);
    // @ts-ignore
    const { ssionChian } = useLocalStorage();
    const { t } = useTranslation();

    useMemo(() => {
        setSpinning(true);
        (async () => {
            let a: any = await GoodsDatas({
                id: info.id,
                sel: keyword,
                gid: 0,
            }, ssionChian);
            let rest: Array<LocalCurrency> = a.tokenValue;
            console.log(a, 33332)
            setTokensValue(rest);
            a.tokens.map((el: any, index: number) => {
                a.tokens[index].key = el.id;
                a.tokens[index].title = (
                    <>
                        <div className="flex items-center">
                            <img src={el.logo_url ?? "/token.svg"} alt="folder" className="treeImg"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "/token.svg";
                                }} />
                            <span>
                                <div>{el.name}</div>
                                <div className="text-xs font-color-1">{el.symbol}</div>
                            </span>
                        </div>
                    </>);
                el.children.map((el1: any, index1: number) => {
                    a.tokens[index].children[index1].key = el1.id;
                    a.tokens[index].children[index1].nodePd = true;
                    a.tokens[index].children[index1].title = (
                        <>
                            <div className="flex justify-between gap-3">
                                <div className="flex items-center">
                                    <img src={el1.logo_url ?? "/token.svg"} alt="folder" className="treeImg"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "/token.svg";
                                        }} />
                                    <span className="whitespace-nowrap">
                                        <div>{el1.name}</div>
                                        <div className="text-xs font-color-1">{el1.symbol}</div>
                                    </span>
                                </div>
                                <Flex className="goods-indexs  gap-2 justify-between" wrap>
                                    <div>
                                        <div>{t('common.invest')}:{prettifyCurrencys(el1.investQuantity)}</div>
                                        <div>{t('body.invest.goods.investfeeee')}:{(el1.investFee * 100).toFixed(2)}%</div>
                                        <div>{t('body.invest.goods.apy')}:{calculateFeePercentage(el1.apy)}</div>
                                    </div>
                                    <div>
                                        <div>{t('body.invest.goods.fee')}:{prettifyCurrencys(el1.feeQuantity)}</div>
                                        <div>{t('body.invest.goods.divestfee')}:{(el1.disinvestFee * 100).toFixed(2)}%</div>
                                    </div>

                                </Flex>
                            </div>
                        </>);
                })
            })
            setTokens(a.tokens);
            setSpinning(false);
        })()
    }, [keyword, info, ssionChian]);
    // console.log(availableTokens,222)
    const isDefault = value.symbol === DEFAULT_TOKEN;

    const showModal = (el: InvestTokenValue) => {
        // console.log(222)
        setOpen(false);
        onChange(el);
        document.body.style.overflow = "";
    };


    const onSelect: TreeProps['onSelect'] = (keys: any, info: any) => {
        // console.log('Trigger Select', info);
        if (info.node.nodePd) {
            setOpen(false);
            onChange(info.node);
            document.body.style.overflow = "";
            console.log('Trigger Select', keys, info);
        }
    };
    const handleClose = (a: boolean, b: string) => {
        setOpen(a);
        document.body.style.overflow = b;
    };
    return (
        <>
            <TokenInvestModal open={open} setOpen={setOpen} title={t('body.swap.goods.title')}>
                <div className="select-head " >
                    {isValue && (
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
                    )}
                    <div className="flex sel-token flexWap">
                        {availableTokens.map((el: any) => (
                            <div
                                onClick={() => showModal(el)}
                                key={el.id}
                                className="flex row cursor-pointer butSty but-hov"
                            >
                                <img alt="icon"
                                    className="w-6"
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
                {isValue && (
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
                )}
            </TokenInvestModal>

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

export default TokenInvestSelector;

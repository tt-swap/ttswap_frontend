import { usePathname, useRouter } from "next/navigation"
import { Input, Tree, Spin, Flex, Button } from "antd";
import type { TreeProps, TreeDataNode } from 'antd';
import { SearchOutlined, DownOutlined, LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';
import { useValueGood } from "@/stores/valueGood";
import { calculateFeePercentage } from "@/utils/functions/calculate-fees-percentage";
import { useLocalStorage } from "@/utils/LocalStorageManager";

import { prettifyCurrencys } from '@/graphql/util';
import { GoodsSearchDatas } from '@/graphql/goods';

const { DirectoryTree } = Tree;

interface Props {
    isValue: string;
}
const GoodsSearch = ({ isValue }: Props) => {

    const router = useRouter()
    const pathname = usePathname()
    const { t } = useTranslation();
    const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
    const { info } = useValueGood();
    const [spinning, setSpinning] = useState(false);
    // @ts-ignore
    const { ssionChian } = useLocalStorage();
    const [keyword, setKeyword] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const searchOpenRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [windowWidth, setWindowWidth] = useState<number>(0);

    const handleTabSwitch = (route: string) => {
        const routeSegments = pathname.split('/');
        routeSegments[3] = route;
        if (routeSegments.length > 4) {
            routeSegments.pop();
        }
        const newRoute = routeSegments.join('/');
        // console.log(newRoute)
        router.push(newRoute);
    }

    const onSelect: TreeProps['onSelect'] = (keys: any, info: any) => {
        if (info.node.nodePd) {
            setSearchOpen(false);
            handleTabSwitch("goods/" + info.node.id);
        }
    };

    useEffect(() => {
        setSpinning(true);
        (async () => {
            let a: any = await GoodsSearchDatas({
                id: info.id,
                sel: keyword
            }, ssionChian);
            console.log(a, 33332)
            a.map((el: any, index: number) => {
                a[index].key = el.id;
                el.title = (
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
                    a[index].children[index1].key = el1.id;
                    a[index].children[index1].nodePd = true;
                    el1.title = (
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
                                <Flex className="goods-indexs  gap-2 justify-between text-end">
                                    <div>
                                        <div>{prettifyCurrencys(el1.price)}{" "}{el1.valueSymbol}</div>
                                        <div
                                            className={`text-right ${parseFloat(el1.h24) > 0 ?
                                                "text-green-600" : "text-red-600"
                                                }`}>{calculateFeePercentage(el1.h24)}</div>
                                    </div>

                                </Flex>
                            </div>
                        </>);
                })
            })
            setTreeData(a);
            setSpinning(false);
        })()
    }, [keyword, info, ssionChian]);

    const handleClickOutside = (event: MouseEvent) => {
        if (searchOpenRef.current && !searchOpenRef.current.contains(event.target as Node)) {
            setSearchOpen(false);
        }
    };

    useEffect(() => {
        if (searchOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            // console.log(inputRef.current,"00000")
            if (inputRef.current) {
                inputRef.current.focus();
            }
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchOpen]);

    useEffect(() => {
        setWindowWidth(window.innerWidth);

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            <div className="search">
                {!searchOpen && windowWidth > 1024 && isValue !== "button" && (
                    <Input
                        placeholder={t('header.menu.search')}
                        prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                        size="large"
                        onFocus={() => setSearchOpen(true)}
                        value={keyword}
                    />
                )}
                {isValue === "button" && windowWidth < 1024 && (
                    <>
                        {!searchOpen && (<Button
                            icon={<SearchOutlined />}
                            onClick={() => setSearchOpen(true)}
                        />)}
                        {searchOpen && (
                            <div className="search-open rt-r-right-0" ref={searchOpenRef}>
                                <div className="flex items-center justify-between mobe-input">
                                    <Input
                                        ref={(input) => {
                                            if (input) {
                                                // @ts-ignore
                                                inputRef.current = input.input;
                                                // @ts-ignore
                                                input.input.focus();
                                            }
                                        }}
                                        className="search-open-input"
                                        placeholder={t('header.menu.search')}
                                        prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        size="large"
                                        onChange={(e: any) => setKeyword(e.target.value)}
                                        value={keyword}
                                    />
                                    <Button
                                        icon={<CloseOutlined />}
                                        onClick={() => setSearchOpen(false)}
                                    />
                                </div>
                                <div className="search-open-goods pt-3">
                                    <div>
                                        {spinning ? (
                                            <div style={{ padding: "40px", justifyContent: "center", display: "flex" }}>
                                                <Spin spinning={spinning} indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                                            </div>
                                        ) : treeData.length > 0 ? (
                                            <DirectoryTree
                                                showIcon={false}
                                                switcherIcon={<DownOutlined />}
                                                height={492}
                                                onSelect={onSelect}
                                                treeData={treeData}
                                            />
                                        ) : (
                                            <div className="text-center p-4">{t('common.nodata')}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
                {searchOpen && isValue !== "button" && (
                    <div className="search-open" ref={searchOpenRef}>
                        <Input
                            ref={(input) => {
                                if (input) {
                                    // @ts-ignore
                                    inputRef.current = input.input;
                                    // @ts-ignore
                                    input.input.focus();
                                }
                            }}
                            className="search-open-input"
                            placeholder={t('header.menu.search')}
                            prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                            size="large"
                            onChange={(e: any) => setKeyword(e.target.value)}
                            value={keyword}
                        />
                        <div className="search-open-goods pt-3">
                            <div>
                                {spinning ? (
                                    <div style={{ padding: "40px", justifyContent: "center", display: "flex" }}>
                                        <Spin spinning={spinning} indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                                    </div>
                                ) : treeData.length > 0 ? (
                                    <DirectoryTree
                                        showIcon={false}
                                        switcherIcon={<DownOutlined />}
                                        height={492}
                                        onSelect={onSelect}
                                        treeData={treeData}
                                    />
                                ) : (
                                    <div className="text-center p-4">{t('common.nodata')}</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default GoodsSearch;

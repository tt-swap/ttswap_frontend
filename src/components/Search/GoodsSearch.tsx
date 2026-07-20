import { useNavigate } from "react-router-dom"
import { Input, Tree, Spin, Flex, Button } from "antd";
import type { TreeProps, TreeDataNode, InputRef } from 'antd';
import { SearchOutlined, DownOutlined, LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import { useValueGood } from "@/stores/valueGood";
import { useLocalStorage } from "@/utils/LocalStorageManager";
import { TokenIcon } from "../common/TokenIcon";
import { GRK_SIZES } from "@/types/common";
import { prettifyCurrencys, calculateFeePercentage } from '@/services/graphql/util';
import { GoodsSearchDatas } from '@/services/graphql/goods';

const { DirectoryTree } = Tree;

// 定义常量
const BREAKPOINTS = {
    DESKTOP: 1024,
} as const;

const SEARCH_DEBOUNCE_MS = 1000;

// 定义类型
interface GoodsSearchProps {
    isValue: string;
}

interface FormattedTreeData extends TreeDataNode {
    id: string;
    name: string;
    symbol: string;
    price: number;
    h24: string;
    valueSymbol: string;
    isvaluegood: boolean;
    logo_url: string;
}

// 自定义 Hook: 窗口大小监听
const useWindowWidth = () => {
    const [width, setWidth] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth : 0
    );

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setWidth(window.innerWidth);
            }, 150);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, []);

    return width;
};

// 自定义 Hook: 防抖
const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
};

// 自定义 Hook: 点击外部关闭
const useClickOutside = (
    ref: React.RefObject<HTMLElement>,
    handler: () => void
) => {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                handler();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, handler]);
};

const GoodsSearch: React.FC<GoodsSearchProps> = ({ isValue }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // State
    const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
    const [spinning, setSpinning] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Refs
    const searchOpenRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<InputRef>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // 外部状态
    const { info } = useValueGood();
    const { ssionChian } = useLocalStorage() as { ssionChian: number };

    // 自定义 Hooks
    const windowWidth = useWindowWidth();
    const debouncedKeyword = useDebounce(keyword, SEARCH_DEBOUNCE_MS);

    // 导航函数
    const navigateTo = useCallback((route: string) => {
        navigate('/' + route);
    }, [navigate]);

    // 搜索处理
    const handleSearch = useCallback(async (searchKeyword: string) => {
        // 取消之前的请求
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        try {
            setSpinning(true);
            setError(null);

            const data: any = await GoodsSearchDatas({
                id: info.id,
                sel: searchKeyword
            }, ssionChian);

            // 检查请求是否被取消
            if (controller.signal.aborted) return;

            // 格式化数据（不修改原始数据）
            const formattedData = data.map((item) => ({
                key: item.id,
                id: item.id,
                name: item.name,
                symbol: item.symbol,
                price: item.price,
                h24: item.h24,
                valueSymbol: item.valueSymbol,
                isvaluegood: item.isvaluegood,
                logo_url: item.logo_url,
                title: renderTreeItem(item),
                isLeaf: true,
            }));

            setTreeData(formattedData);
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                // 请求被取消，不做处理
                return;
            }
            console.error('Search failed:', err);
            setError(t('common.mess.searchError'));
            setTreeData([]);
        } finally {
            if (!controller.signal.aborted) {
                setSpinning(false);
            }
        }
    }, [info.id, ssionChian, t]);

    // 渲染树节点
    const renderTreeItem = useCallback((item) => {
        const priceChange = parseFloat(item.h24);
        const isPositive = priceChange > 0;

        return (
            <div className="flex justify-between gap-3">
                <div className="flex items-center">
                    <TokenIcon
                        isValueToken={item.isvaluegood}
                        icon={item.logo_url}
                        color=""
                        size={GRK_SIZES.EXTRA_SMALL}
                        showPulse={item.isvaluegood}
                    />
                    <span className="whitespace-nowrap ml-3">
                        <div>{item.name}</div>
                        <div className="text-xs font-color-1">{item.symbol}</div>
                    </span>
                </div>
                <Flex className="goods-indexs gap-2 justify-between text-end">
                    <div>
                        <div>
                            {prettifyCurrencys(item.price)}{" "}{item.valueSymbol}
                        </div>
                        <div className={`text-right ${isPositive ? "text-green-600" : "text-red-600"}`}>
                            {calculateFeePercentage(item.h24)}
                        </div>
                    </div>
                </Flex>
            </div>
        );
    }, []);

    // 树节点选择
    const handleSelect: TreeProps['onSelect'] = useCallback((keys, info) => {
        console.log('Selected:', keys, info);
        setSearchOpen(false);
        navigateTo(`tokens/${keys[0]}`);
        setKeyword("");
    }, [navigateTo]);

    // 搜索框获得焦点
    const handleInputFocus = useCallback(() => {
        setSearchOpen(true);
        // 延迟聚焦以确保 DOM 已更新
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }, []);

    // 关闭搜索
    const handleClose = useCallback(() => {
        setSearchOpen(false);
        setKeyword("");
        setError(null);
    }, []);

    // 使用防抖后的关键词进行搜索
    useEffect(() => {
        if (searchOpen && debouncedKeyword !== undefined) {
            handleSearch(debouncedKeyword);
        }
    }, [debouncedKeyword, searchOpen, handleSearch]);

    // 点击外部关闭
    useClickOutside(searchOpenRef, handleClose);

    // 清理函数
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    // 搜索输入组件
    const SearchInput = useMemo(() => (
        <Input
            ref={inputRef}
            className="search-open-input"
            placeholder={t('header.menu.search')}
            prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
            size="large"
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
            allowClear
        />
    ), [keyword, t]);

    // 搜索结果组件
    const SearchResults = useMemo(() => {
        if (spinning) {
            return (
                <div className="flex justify-center p-10">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center p-4 text-red-500">
                    {error}
                </div>
            );
        }

        if (treeData.length === 0) {
            return (
                <div className="text-center p-4 text-gray-500">
                    {t('common.nodata')}
                </div>
            );
        }

        return (
            <DirectoryTree
                showIcon={false}
                switcherIcon={<DownOutlined />}
                height={492}
                onSelect={handleSelect}
                treeData={treeData}
            />
        );
    }, [spinning, error, treeData, handleSelect]);

    // 判断是否为桌面端搜索模式
    const isDesktopSearch = !searchOpen && windowWidth > BREAKPOINTS.DESKTOP && isValue !== "button";
    // 判断是否为移动端搜索模式
    const isMobileSearch = isValue === "button" && windowWidth < BREAKPOINTS.DESKTOP;

    return (
        <div className="search">
            {/* 桌面端：内联搜索框 */}
            {isDesktopSearch && (
                <Input
                    placeholder={t('header.menu.search')}
                    prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                    size="large"
                    onFocus={handleInputFocus}
                    value={keyword}
                    readOnly
                />
            )}

            {/* 移动端：按钮触发搜索 */}
            {isMobileSearch && !searchOpen && (
                <Button
                    icon={<SearchOutlined />}
                    onClick={handleInputFocus}
                    aria-label={t('header.menu.search')}
                />
            )}

            {/* 搜索弹窗 */}
            {searchOpen && (
                <div
                    className={`search-open ${isMobileSearch ? 'rt-r-right-0' : ''}`}
                    ref={searchOpenRef}
                >
                    {/* 移动端显示关闭按钮 */}
                    <div className="flex items-center justify-between mobe-input">
                        {/* <div className="flex-1">
                            {SearchInput}
                        </div> */}
                        {isMobileSearch && (
                            <div>{SearchInput}
                                <Button
                                    icon={<CloseOutlined />}
                                    onClick={handleClose}
                                    className="ml-2"
                                /></div>
                        )}
                    </div>

                    {/* 非移动端显示搜索输入框 */}
                    {!isMobileSearch && SearchInput}

                    {/* 搜索结果 */}
                    <div className="search-open-goods pt-3">
                        {SearchResults}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GoodsSearch;
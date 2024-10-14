import { type Option, None, Some } from "@/utils/option";
import { type Pool } from "@/utils/types/XykServiceTypes";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import {
    type ColumnDef,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TokenAvatar } from "../../../Atoms";
import { Button, Spin, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { TableHeaderSorting } from "@/components/ui/tableHeaderSorting";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { type XYKPoolListViewProps } from "@/utils/types/organisms.types";
import { SkeletonTable } from "@/components/ui/skeletonTable";

import { myGoodsDatas } from '@/graphql/account';
import { prettifyCurrencys, prettifyCurrencysFee } from '@/graphql/util';

export const XYKWalletPoolListView: React.FC<XYKPoolListViewProps> = ({
    chain_name,
    dex_name,
    on_pool_click,
    page_size, value_good_id, wallet_address, data_num, chain_id
}) => {
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "investQuantity",
            desc: true,
        },
    ]);
    const [rowSelection, setRowSelection] = useState({});
    const [maybeResult, setResult] = useState<Option<Pool[]>>(None);
    const [error, setError] = useState({ error: false, error_message: "" });
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [pagination, setPagination] = useState({
        page_number: 1,
    });
    const [hasMore, setHasMore] = useState<boolean>();
    const [spinning, setSpinning] = useState(false);
    const { t } = useTranslation();

    const handlePagination = (page_number: number) => {
        setPagination((prev) => {
            return {
                ...prev,
                page_number,
            };
        });
    };

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
            if (hasMore) {
                handlePagination(pagination.page_number + 1);
            }
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.addEventListener("scroll", handleScroll);
            return () => {
                window.removeEventListener("scroll", handleScroll);
            };
        }
    }, [hasMore, pagination]);


    useEffect(() => {
        (async () => {
            setSpinning(true);
            // setResult(None);
            let response: any;
            try {
                response =
                    await myGoodsDatas({
                        id: value_good_id,
                        pageNumber: pagination.page_number - 1,
                        // @ts-ignore
                        pageSize: page_size,
                        address: wallet_address,
                    }, chain_id);
                console.log(response, value_good_id, "myGoods")
                setHasMore(response.pagination.has_more);
                setError({ error: false, error_message: "" });
                setResult(prev => {
                    if (pagination.page_number === 1 || prev.match({ None: () => true, Some: () => false })) {
                        return new Some(Array.isArray(response.items) ? response.items : []); // 确保是数组
                    } else {
                        const existingItems = prev.match({
                            None: () => [],
                            Some: (items) => items,
                        });
                        return new Some([...existingItems, ...(Array.isArray(response.items) ? response.items : [])]); // 确保是数组
                    }
                });
            } catch (exception) {
                setResult(new Some([]));
                setError({
                    error: response ? response.error : false,
                    error_message: response ? response.error_message : "",
                });
            }
            setSpinning(false);
        })();
    }, [chain_name, dex_name, pagination, value_good_id, wallet_address, data_num]);

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

    const columns: ColumnDef<Pool>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: () => (
                <div className="ml-4">
                    {t('body.account.tabs.goods.name')}
                </div>
            ),
            cell: ({ row }) => {
                return (
                    <a
                        className="cursor-pointer hover:opacity-75"
                        onClick={() => {
                            if (on_pool_click) {
                                on_pool_click("goods/" + row.original.id, row.original.id);
                            }
                        }}
                    >
                        <div className="ml-4 flex items-center gap-2">
                            <TokenAvatar
                                size={GRK_SIZES.EXTRA_SMALL}
                                token_url={row.original.logo_url}
                            />
                            <div>
                                <span>{row.original.name ? row.original.name : ""}</span>
                            </div>
                            <div>
                                <span style={{ color: "#999" }}>{row.original.symbol ? row.original.symbol : ""}</span>
                            </div>
                        </div>
                    </a>
                );
            },
        },
        {
            id: "price",
            accessorKey: "price",
            header: () => (
                <div className="text-right">
                    {t('body.account.tabs.goods.price')}
                </div>
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencys(
                    row.original.price
                );
                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "unitFee",
            accessorKey: "unitFee",
            header: () => (
                <div className="text-right">
                    {t('body.account.tabs.goods.unitfee')}
                </div>
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencysFee(
                    row.original.unitFee
                );
                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "investQuantity",
            accessorKey: "investQuantity",
            header: ({ column }) => (
                // <div className="text-right">
                //     Invest Volume
                // </div>
                <TableHeaderSorting
                    align="right"
                    header_name=
                    {t('body.account.tabs.goods.quanity')}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencys(row.original.investQuantity);
                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "currentQuantity",
            accessorKey: "currentQuantity",
            header: () => (
                <div className="text-right">
                    {t('body.account.tabs.goods.volume')}
                </div>
                // <TableHeaderSorting
                //     align="right"
                //     header_name={"Current Volume"}
                //     column={column}
                // />
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencys(
                    row.original.currentQuantity
                );
                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "totalFee",
            accessorKey: "totalFee",
            header: () => (
                <div className="text-right">
                    {t('body.account.tabs.goods.feevolume')}
                </div>
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencysFee(
                    row.original.totalFee
                );
                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "actions",
            header: () => (
                <div className="text-right mr-4">
                    {t('common.actions')}
                </div>
            ),
            cell: ({ row }) => {
                return (
                    <div className="text-right mr-4">
                        <Space>
                            <Button
                                type="primary"
                                onClick={() => {
                                    on_pool_click("swap", row.original.id);
                                }}
                            >
                    {t('common.swap')}
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    on_pool_click("invest", row.original.id);
                                }}
                            >
                    {t('common.invest')}
                            </Button>
                        </Space>
                    </div>
                );
            },
        },
    ];

    const mobile_columns: ColumnDef<Pool>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: () => (
                <div className="ml-4">
                    {t('body.account.tabs.goods.name')}
                </div>
            ),
            cell: ({ row }) => {
                return (
                    <a
                        className="cursor-pointer hover:opacity-75"
                        onClick={() => {
                            if (on_pool_click) {
                                on_pool_click("goods/" + row.original.id, row.original.id);
                            }
                        }}
                    >
                        <div className="ml-4 flex items-center gap-2">
                            <TokenAvatar
                                size={GRK_SIZES.EXTRA_SMALL}
                                token_url={row.original.logo_url}
                            />
                            <div>
                                <span>{row.original.name ? row.original.name : ""}</span>
                            </div>
                            <div>
                                <span style={{ color: "#999" }}>{row.original.symbol ? row.original.symbol : ""}</span>
                            </div>
                        </div>
                    </a>
                );
            },
        },
        {
            id: "actions",
            header: () => (
                <div className="text-right mr-4">
                    {t('common.actions')}
                </div>
            ),
            cell: ({ row }) => {
                return (
                    <div className="text-right mr-4">
                        <Space>
                            <Button
                                type="primary"
                                onClick={() => {
                                    on_pool_click("swap", row.original.id);
                                }}
                            >
                    {t('common.swap')}
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    on_pool_click("invest", row.original.id);
                                }}
                            >
                    {t('common.invest')}
                            </Button>
                        </Space>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: maybeResult.match({
            None: () => [],
            Some: (result) => result,
        }),
        columns: windowWidth < 700 ? mobile_columns : columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
        },
    });

    const body = maybeResult.match({
        None: () => <SkeletonTable float="right" />,
        Some: () =>
            error.error ? (
                <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                    >
                        {error.error_message}
                    </TableCell>
                </TableRow>
            ) : !error.error && table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                    >
                        {t('common.nodata')}
                    </TableCell>
                </TableRow>
            ),
    });

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef
                                                    .header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>{body}</TableBody>
            </Table>
            <div className="flex justify-center">
                <Spin
                    spinning={spinning}
                    indicator={<LoadingOutlined spin />}
                    tip="Loading"
                // size="small"
                >
                    <div />
                </Spin>
            </div>
        </div>
    );
};

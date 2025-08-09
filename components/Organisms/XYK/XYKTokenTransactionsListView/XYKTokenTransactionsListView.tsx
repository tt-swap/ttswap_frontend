import { type Option, None, Some } from "@/utils/option";
import { type ExchangeTransaction } from "@/utils/types/XykServiceTypes";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { POOL_TRANSACTION_MAP } from "@/utils/constants/shared.constants";
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
import { Badge } from "@/components/ui/badge";
import { timestampParser } from "@/utils/functions";
import { Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { TableHeaderSorting } from "@/components/ui/tableHeaderSorting";
import { type XYKTokenTransactionsListViewProps } from "@/utils/types/organisms.types";
import { SkeletonTable } from "@/components/ui/skeletonTable";

import { goodsTransactionsDatas } from '@/graphql/goods';
import { prettifyCurrencys } from '@/graphql/util';

export const XYKTokenTransactionsListView: React.FC<XYKTokenTransactionsListViewProps> = ({
    chain_name,
    dex_name,
    on_transaction_click,
    on_native_explorer_click,
    on_goldrush_receipt_click,
    token_address,
    page_size, value_good_id, chain_id
}) => {

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "time",
            desc: true,
        },
    ]);
    const [rowSelection, setRowSelection] = useState({});
    const [maybeResult, setResult] = useState<Option<ExchangeTransaction[]>>(None);
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
                    // @ts-ignore
                    await goodsTransactionsDatas({ id: value_good_id, address: token_address, pageNumber: pagination.page_number - 1, pageSize: page_size }, chain_id);
                console.log("goodsTransactionsDatas",response)
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
    }, [chain_name, dex_name, pagination, value_good_id, token_address, chain_id]);

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

    const columns: ColumnDef<ExchangeTransaction>[] = [
        {
            accessorKey: "time",
            header: ({ column }) => (
                <div className="ml-4">
                    <TableHeaderSorting
                        align="left"
                        header_name={t('body.account.tabs.transactions.time')}
                        column={column}
                    />
                </div>
            ),
            cell: ({ row }) => {
                // @ts-ignore
                const t = row.original.time;

                return (
                    <div className="ml-4">{timestampParser(t, "relative")}</div>
                );
            },
        },
        {
            accessorKey: "type",
            header: () => (
                <div className="text-left">
                    {t('body.account.tabs.transactions.type')}
                </div>
            ),
            cell: ({ row }) => {
                const token_0 = row.original.symbol1;
                const token_1 = row.original.symbol2;
                return (
                    <div
                        className={
                            on_transaction_click
                                ? "cursor-pointer hover:opacity-75"
                                : ""
                        }
                        onClick={() => {
                            if (on_transaction_click) {
                                on_transaction_click(row.original);
                            }
                        }}
                    >
                        <Badge
                            className="mr-2"
                            variant={POOL_TRANSACTION_MAP["SWAP"].color}
                        >
                            {
                                row.original.type}
                        </Badge>{" "}
                        {token_0}{" "}
                        {token_1 === "#" ? "" : "/"}{" "}
                        {token_1 === "#" ? "" : token_1}
                    </div>
                );
            },
        },
        // {
        //     id: "totalValue",
        //     accessorKey: "totalValue",
        //     header: () => (
        //         <div className="">
        //             {t('body.account.tabs.transactions.value')}
        //         </div>
        //     ),
        //     cell: ({ row }) => {
        //         return <>{prettifyCurrencys(row.original.totalValue)}{" "}{row.original.valueSymbol}</>;
        //     },
        // },
        {
            id: "fromgoodQuanity",
            accessorKey: "fromgoodQuanity",
            header: () => (
                <div className="">
                    {t('body.account.tabs.transactions.quanity1')}
                </div>
            ),
            cell: ({ row }) => {
                if (row.original.type === 'divest' || row.original.type === 'invest') {
                    return (<><span>{prettifyCurrencys(row.original.fromgoodQuanity) + " / "}</span>
                        <span style={{ color: "#86d38b" }}>{prettifyCurrencys(row.original.fromgoodActualQuanity)}</span>
                        <span>{" "}{row.original.symbol1}</span></>);
                } else {
                    return (<span>{prettifyCurrencys(row.original.fromgoodQuanity)}{" "}{row.original.symbol1}</span>);
                }
            },
        },
        {
            id: "togoodQuantity",
            accessorKey: "togoodQuantity",
            header: () => (
                <div className="">
                    {t('body.account.tabs.transactions.quanity2')}
                </div>
            ),
            cell: ({ row }) => {
                if (row.original.symbol2 === "#") {
                    return (<span>-</span>);
                } else {
                    if (row.original.type === 'divest' || row.original.type === 'invest') {
                        return (<><span>{prettifyCurrencys(row.original.togoodQuantity) + " / "}</span>
                            <span style={{ color: "#86d38b" }}>{prettifyCurrencys(row.original.togoodActualQuantity)}</span>
                            <span>{" "}{row.original.symbol2}</span></>);
                    } else {
                        return (<span>{prettifyCurrencys(row.original.togoodQuantity)}{" "}{row.original.symbol2}</span>);
                    }
                }
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
                if (!on_native_explorer_click && !on_goldrush_receipt_click)
                    return;
                return (
                    <div className="text-right mr-4">
                        {on_native_explorer_click && (
                            <Button
                                // shape="round"
                                type="primary"
                                // size="large"
                                onClick={() => {
                                    on_native_explorer_click(
                                        row.original.hash
                                    );
                                }}
                            >
                                {t('body.account.tabs.transactions.hash')}
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];

    const mobile_columns: ColumnDef<ExchangeTransaction>[] = [
        {
            accessorKey: "time",
            header: ({ column }) => (
                <div className="ml-4">
                    <TableHeaderSorting
                        align="left"
                        header_name=
                        {t('body.account.tabs.transactions.time')}
                        column={column}
                    />
                </div>
            ),
            cell: ({ row }) => {
                // @ts-ignore
                const t = row.original.time;

                return (
                    <div className="ml-4">{timestampParser(t, "relative")}</div>
                );
            },
        },
        {
            accessorKey: "type",
            header: () => (
                <div className="text-left">
                    {t('body.account.tabs.transactions.type')}
                </div>
            ),
            cell: ({ row }) => {
                const token_0 = row.original.symbol1;
                const token_1 = row.original.symbol2;
                return (
                    <div
                        className={
                            on_transaction_click
                                ? "cursor-pointer hover:opacity-75"
                                : ""
                        }
                        onClick={() => {
                            if (on_transaction_click) {
                                on_transaction_click(row.original);
                            }
                        }}
                    >
                        <Badge
                            className="mr-2"
                            variant={POOL_TRANSACTION_MAP["SWAP"].color}
                        >
                            {
                                row.original.type}
                        </Badge>{" "}
                        {token_0}{" "}
                        {token_1 === "#" ? "" : "/"}{" "}
                        {token_1 === "#" ? "" : token_1}
                    </div>
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
                if (!on_native_explorer_click && !on_goldrush_receipt_click)
                    return;
                return (
                    <div className="text-right mr-4">
                        {on_native_explorer_click && (
                            <Button
                                // shape="round"
                                type="primary"
                                // size="large"
                                onClick={() => {
                                    on_native_explorer_click(
                                        row.original.hash
                                    );
                                }}
                            >
                                {t('body.account.tabs.transactions.hash')}
                            </Button>
                        )}
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

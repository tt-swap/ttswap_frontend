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
import { type XYKWalletTransactionsListViewProps } from "@/utils/types/organisms.types";
import { SkeletonTable } from "@/components/ui/skeletonTable";

import { myRefereesDatas } from '@/graphql/account';
import { prettifyCurrencys } from '@/graphql/util';
import { getEllipsisTxt } from "utils/formatters";

export const XYKWalletRefereesView: React.FC<XYKWalletTransactionsListViewProps> = ({
    chain_name,
    dex_name,
    on_transaction_click,
    on_native_explorer_click,
    on_goldrush_receipt_click,
    page_size, wallet_address, value_good_id, data_num, chain_id
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
                    await myRefereesDatas({ id: value_good_id, address: wallet_address, pageNumber: pagination.page_number - 1, pageSize: page_size }, chain_id);
                // console.log(response)
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


    const columns: ColumnDef<ExchangeTransaction>[] = [
        {
            accessorKey: "id",
            header: () => (
                <div className="ml-4">
                    {t('body.account.tabs.referees.address')}
                </div>
            ),
            cell: ({ row }) => {
                // @ts-ignore
                const t = row.original.id;

                return (
                    <div className="ml-4">{getEllipsisTxt(t, 6)}</div>
                );
            },
        },
        {
            id: "tradeValue",
            accessorKey: "tradeValue",
            header: () => (
                <div className="">
                    {t('body.account.tabs.referees.trade')}
                </div>
            ),
            cell: ({ row }) => {
                return <>{prettifyCurrencys(row.original.tradeValue)}{" "}{row.original.valueSymbol}</>;
            },
        },
        {
            id: "investValue",
            accessorKey: "investValue",
            header: () => (
                <div className="">
                    {t('body.account.tabs.referees.invest')}
                </div>
            ),
            cell: ({ row }) => {
                return <>{prettifyCurrencys(row.original.investValue)}{" "}{row.original.valueSymbol}</>;
            },
        },
        {
            id: "disinvestValue",
            accessorKey: "disinvestValue",
            header: () => (
                <div className="">
                    {t('body.account.tabs.referees.divest')}
                </div>
            ),
            cell: ({ row }) => {
                return <>{prettifyCurrencys(row.original.disinvestValue)}{" "}{row.original.valueSymbol}</>;
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
                                        row.original.link
                                    );
                                }}
                            >
                                {t('body.account.tabs.referees.link')}
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];

    const mobile_columns: ColumnDef<ExchangeTransaction>[] = [
        {
            accessorKey: "id",
            header: () => (
                <div className="ml-4">
                    {t('body.account.tabs.referees.address')}
                </div>
            ),
            cell: ({ row }) => {
                // @ts-ignore
                const t = row.original.id;

                return (
                    <div className="ml-4">{getEllipsisTxt(t, 6)}</div>
                );
            },
        },
        {
            id: "tradeValue",
            accessorKey: "tradeValue",
            header: () => (
                <div className="">
                    {t('body.account.tabs.referees.trade')}
                </div>
            ),
            cell: ({ row }) => {
                return <>{prettifyCurrencys(row.original.tradeValue)}{" "}{row.original.valueSymbol}</>;
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
                                        row.original.link
                                    );
                                }}
                            >
                                {t('body.account.tabs.referees.link')}
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

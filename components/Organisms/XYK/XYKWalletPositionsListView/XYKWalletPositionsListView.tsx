import { type Option, None, Some } from "@/utils/option";
import { type walletPool } from "@/utils/types/XykServiceTypes";
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
import { Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { TableHeaderSorting } from "@/components/ui/tableHeaderSorting";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { type XYKWalletPositionsListViewProps } from "@/utils/types/organisms.types";
import { calculateFeePercentage } from "@/utils/functions/calculate-fees-percentage";
import { SkeletonTable } from "@/components/ui/skeletonTable";

import { myInvestGoodsDatas } from '@/graphql/account';
import { prettifyCurrencys, prettifyCurrencysFee } from '@/graphql/util';

export const XYKWalletPositionsListView: React.FC<XYKWalletPositionsListViewProps> = ({
    chain_name,
    dex_name,
    on_pool_click,
    page_size, wallet_address, value_good_id, data_num, is_over, chain_id
}) => {
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "totalInvestValue",
            desc: true,
        },
    ]);
    const [rowSelection, setRowSelection] = useState({});
    const [maybeResult, setResult] = useState<Option<walletPool[]>>(None);
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
                    await myInvestGoodsDatas({ id: value_good_id, address: wallet_address, pageNumber: pagination.page_number - 1, pageSize: page_size }, chain_id);
                console.log(response, value_good_id)
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


    const columns: ColumnDef<walletPool>[] = [

        // {
        //     id: "id",
        //     accessorKey: "id",
        //     header: () => (
        //         <div className="text-left ml-4">
        //             #
        //         </div>
        //     ),
        //     cell: ({ row }) => {
        //         return (
        //             <div className="text-left ml-4">
        //                 {// @ts-ignore
        //                     row.original.id}
        //             </div>
        //         );
        //     },
        // },
        {
            id: "name",
            accessorKey: "name",
            header: () => (
                <div className="text-left ml-4">
                    {t('body.account.tabs.proof.name')}
                </div>
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2 ml-4">
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
                );
            },
        },
        {
            id: "totalInvestValue",
            accessorKey: "totalInvestValue",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={t('body.account.tabs.proof.value')}
                    column={column}
                />
            ),
            cell: ({ row }) => {

                const valueFormatted = prettifyCurrencys(
                    // @ts-ignore
                    row.original.totalInvestValue
                );

                return <div className="text-right">{valueFormatted}{" "}{// @ts-ignore
                    row.original.valueSymbol}</div>;
            },
        },
        {
            id: "investQuantity",
            accessorKey: "investQuantity",
            header: () => (
                <div className="text-right">
                    {t('body.account.tabs.proof.quanity')}
                </div>
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencys(
                    // @ts-ignore
                    row.original.investQuantity
                );

                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "unitFee",
            accessorKey: "unitFee",
            header: () => (
                <div className="text-right">
                    {t('body.account.tabs.proof.unitfee')}
                </div>
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencysFee(
                    // @ts-ignore
                    row.original.unitFee
                );

                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "profit",
            accessorKey: "profit",
            header: () => (
                <div className="text-right">
                    {t('body.account.tabs.proof.profit')}
                </div>
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencysFee(
                    // @ts-ignore
                    row.original.profit
                );

                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "earningRate",
            accessorKey: "earningRate",
            header: () => (
                <div className="text-right">
                    {t('body.account.tabs.proof.earningrate')}
                </div>
            ),
            cell: ({ row }) => {
                const valueFormatted = calculateFeePercentage(
                    // @ts-ignore
                    row.original.earningRate
                );

                return (
                    <div
                        className={`text-right ${
                            // @ts-ignore
                            parseFloat(row.original.earningRate) > 0 ?
                                "text-green-600" : "text-red-600"
                            }`}
                    >
                        {valueFormatted}
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
                return (
                    <div className="text-right mr-4">
                        <Button
                            type="primary"
                            onClick={() => {
                                if (on_pool_click) {
                                    on_pool_click(row.original.id);
                                }
                            }}
                        >
                            {t('common.divest')}
                        </Button>
                    </div>
                );
            },
        },
    ];

    const mobile_columns: ColumnDef<walletPool>[] = [
        // {
        //     id: "id",
        //     accessorKey: "id",
        //     header: () => (
        //         <div className="text-left ml-4">
        //             #
        //         </div>
        //     ),
        //     cell: ({ row }) => {
        //         return (
        //             <div className="text-left ml-4">
        //                 {// @ts-ignore
        //                     row.original.id}
        //             </div>
        //         );
        //     },
        // },
        {
            id: "name",
            accessorKey: "name",
            header: () => (
                <div className="text-left ml-4">
                    {t('body.account.tabs.proof.name')}
                </div>
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-2 ml-4">
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
                );
            },
        },
        {
            id: "profit",
            accessorKey: "profit",
            header: () => (
                <div className="text-right">
                    {t('body.account.tabs.proof.profit')}
                </div>
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencysFee(
                    // @ts-ignore
                    row.original.profit
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
                        <Button
                            type="primary"
                            onClick={() => {
                                if (on_pool_click) {
                                    on_pool_click(row.original.id);
                                }
                            }}
                        >
                            {t('common.divest')}
                        </Button>
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

    // console.log("000000000000",table.getRowModel().rows[0].getVisibleCells()[0].column.id==="id")
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
                            <TableCell key={cell.id} style={{ maxWidth: cell.column.id === "id" ? "50px" : "", minWidth: cell.column.id === "id" ? "50px" : "" }}>
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

import { type Option, None, Some } from "@/utils/option";
import { type Pool } from "@/utils/types/XykServiceTypes";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Button } from "@/components/ui/button";
import { TableHeaderSorting } from "@/components/ui/tableHeaderSorting";
import { IconWrapper } from "@/components/Shared";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type XYKPoolListViewProps } from "@/utils/types/organisms.types";
import { calculateFeePercentage } from "@/utils/functions/calculate-fees-percentage";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { SkeletonTable } from "@/components/ui/skeletonTable";
import { Tooltip, message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import useWallet from "@/hooks/useWallet";

import { myCommissions } from '@/graphql/account';
import { prettifyCurrencys, prettifyCurrencysFee } from '@/graphql/util';

export const XYKWalletCommissionListView: React.FC<XYKPoolListViewProps> = ({
    chain_name,
    dex_name,
    on_pool_click,
    page_size, value_good_id, is_over, wallet_address, data_num, chain_id
}) => {
    const { covalentClient } = useGoldRush();

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "totalTradeCount",
            desc: true,
        },
    ]);
    const [rowSelection, setRowSelection] = useState({});
    const [maybeResult, setResult] = useState<Option<Pool[]>>(None);
    const [collectIds, setCollectIds] = useState<[]>();
    const [error, setError] = useState({ error: false, error_message: "" });
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [pagination, setPagination] = useState({
        page_number: 1,
    });
    const [hasMore, setHasMore] = useState<boolean>();
    const [spinning, setSpinning] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const handlePagination = (page_number: number) => {
        setPagination((prev) => {
            return {
                ...prev,
                page_number,
            };
        });
    };

    const { collect } = useWallet();

    const text = <span>Collect current display goods commission.</span>;

    const collectCommission = async () => {
        setSpinning(true);
        const isSuccess = await collect(collectIds);
        console.log(isSuccess)
        if (isSuccess) {
            messageApi.open({
                type: 'success',
                content: 'Collect data send success',
            });
        } else {
            messageApi.open({
                type: 'error',
                content: 'Collect data send fail',
            });
        }
        setSpinning(false);
        document.body.style.overflow = "";

    }

    useEffect(() => {
        (async () => {
            setResult(None);
            let response: any;
            try {
                response =
                    await myCommissions({
                        id: value_good_id,
                        pageNumber: pagination.page_number - 1,
                        // @ts-ignore
                        pageSize: page_size,
                        address: wallet_address,
                    }, chain_id);
                console.log(response, value_good_id, "myCommissions")
                setHasMore(response.pagination.has_more);
                setError({ error: false, error_message: "" });
                setResult(new Some(response.items));
                setCollectIds(response.ids);
            } catch (exception) {
                setResult(new Some([]));
                setError({
                    error: response ? response.error : false,
                    error_message: response ? response.error_message : "",
                });
            }
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
            header: ({ column }) => (
                <div className="ml-4">
                    <TableHeaderSorting
                        align="left"
                        header_name={"Name"}
                        column={column}
                    />
                </div>
            ),
            cell: ({ row }) => {
                return (
                    <div className="ml-4 flex items-center gap-3">
                        <TokenAvatar
                            size={GRK_SIZES.EXTRA_SMALL}
                            token_url={// @ts-ignore
                                row.original.logo_url}
                        />
                        <div className="flex flex-col">
                            {on_pool_click ? (
                                <a
                                    className="cursor-pointer hover:opacity-75"
                                // onClick={() => {
                                //     if (on_pool_click) {
                                //         on_pool_click(
                                //             row.original.id
                                //         );
                                //     }
                                // }}
                                >
                                    <span style={{ fontWeight: "600", paddingRight: "5px" }}>{row.original.name ? row.original.name : ""}</span>
                                    <span style={{ color: "#999" }}>{row.original.symbol ? row.original.symbol : ""}</span>
                                    {/* {// @ts-ignore
                                    row.original.name ? row.original.name : ""}{" "}{row.original.symbol} */}
                                </a>
                            ) : (
                                <label className="text-base">
                                    <span style={{ fontWeight: "600", paddingRight: "5px" }}>{row.original.name ? row.original.name : ""}</span>
                                    <span style={{ color: "#999" }}>{row.original.symbol ? row.original.symbol : ""}</span>
                                    {/* {// @ts-ignore
                                    row.original.name ? row.original.name : ""}{" "}{row.original.symbol} */}
                                </label>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            id: "totalFeeQantity",
            accessorKey: "totalFeeQantity",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Total Fee Qantity"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencys(
                    // @ts-ignore
                    row.original.totalFeeQantity
                );

                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "totalFeeAmount",
            accessorKey: "totalFeeAmount",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Total Fee Amount"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencysFee(
                    // @ts-ignore
                    row.original.totalFeeAmount
                );

                return <div className="text-right">{valueFormatted}{" "}{// @ts-ignore
                    row.original.valueSymbol}</div>;
            },
        },
        {
            id: "myFeeQuanity",
            accessorKey: "myFeeQuanity",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"My Fee Quanity"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                // @ts-ignore

                const valueFormatted = prettifyCurrencys(row.original.myFeeQuanity);

                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "myFeeAmount",
            accessorKey: "myFeeAmount",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"My Fee Amount"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencys(
                    row.original.myFeeAmount
                );

                return <div className="text-right">{valueFormatted}{" "}{// @ts-ignore
                    row.original.valueSymbol}</div>;
            },
        },
        // {
        //     id: "actions",
        //     cell: ({ row }) => {
        //         return (
        //             <div className="text-right">
        //                 <DropdownMenu>
        //                     <DropdownMenuTrigger asChild>
        //                         <Button variant="ghost" className="ml-auto  ">
        //                             <span className="sr-only">Open menu</span>
        //                             <IconWrapper icon_class_name="expand_more" />
        //                         </Button>
        //                     </DropdownMenuTrigger>
        //                     <DropdownMenuContent align="end">
        //                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
        //                         <DropdownMenuItem
        //                             onClick={() => {
        //                                 if (on_pool_click) {
        //                                     // @ts-ignore
        //                                     on_pool_click("invest", row.original.id);
        //                                     // on_pool_click(
        //                                     //     row.original.exchange
        //                                     // );
        //                                 }
        //                             }}
        //                         >
        //                             <IconWrapper
        //                                 icon_class_name="swap_horiz"
        //                                 class_name="mr-2"
        //                             />{" "}
        //                             Invest
        //                         </DropdownMenuItem>
        //                     </DropdownMenuContent>
        //                 </DropdownMenu>
        //             </div>
        //         );
        //     },
        // },
    ];

    const mobile_columns: ColumnDef<Pool>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Name"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                // const token_0 = row.original.token_0;
                // const token_1 = row.original.token_1;
                // const pool = `${token_0.contract_ticker_symbol}/${token_1.contract_ticker_symbol}`;

                return (
                    <div className="flex items-center gap-3">
                        <div className="relative mr-2 flex">
                            <TokenAvatar
                                size={GRK_SIZES.EXTRA_SMALL}
                                // @ts-ignore
                                token_url={row.original.logo_url}
                            />
                            {/* <div className="absolute left-4">
                                <TokenAvatar
                                    size={GRK_SIZES.EXTRA_SMALL}
                                    token_url={token_1.logo_url}
                                />
                            </div> */}


                            <div className="flex flex-col">
                                {on_pool_click ? (
                                    <a
                                        className="cursor-pointer hover:opacity-75"
                                        onClick={() => {
                                            if (on_pool_click) {
                                                on_pool_click(
                                                    // @ts-ignore
                                                    row.original.id
                                                );
                                            }
                                        }}
                                    >
                                        {// @ts-ignore
                                            row.original.name ? row.original.name : ""}
                                    </a>
                                ) : (
                                    <label className="text-base">
                                        {// @ts-ignore
                                            row.original.name ? row.original.name : ""}
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            id: "totalFeeQantity",
            accessorKey: "totalFeeQantity",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Total Fee Qantity"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencys(
                    // @ts-ignore
                    row.original.totalFeeQantity
                );

                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "myFeeQuanity",
            accessorKey: "myFeeQuanity",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"My Fee Quanity"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencys(
                    // @ts-ignore
                    row.original.investValue
                );

                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        // {
        //     id: "totalInvestQuantity",
        //     accessorKey: "totalInvestQuantity",
        //     header: ({ column }) => (
        //         <TableHeaderSorting
        //             align="right"
        //             header_name={"Total Invest Quantity"}
        //             column={column}
        //         />
        //     ),
        //     cell: ({ row }) => {
        //         const valueFormatted = prettifyCurrencys(
        //             row.original.totalInvestQuantity
        //         );

        //         return <div className="text-right">{valueFormatted}</div>;
        //     },
        // },
        // {
        //     id: "totalInvestValue",
        //     accessorKey: "totalInvestValue",
        //     header: ({ column }) => (
        //         <TableHeaderSorting
        //             align="right"
        //             header_name={"Total Invest Amount"}
        //             column={column}
        //         />
        //     ),
        //     cell: ({ row }) => {
        //         const valueFormatted = prettifyCurrencys(
        //             row.original.totalInvestValue
        //         );

        //         return <div className="text-right">{valueFormatted}</div>;
        //     },
        // },
        // {
        //     id: "investQuantity24",
        //     accessorKey: "investQuantity24",
        //     header: ({ column }) => (
        //         <TableHeaderSorting
        //             align="right"
        //             header_name={"Invest Quantity(24h)"}
        //             column={column}
        //         />
        //     ),
        //     cell: ({ row }) => {
        //         const valueFormatted = prettifyCurrencys(
        //             row.original.investQuantity24
        //         );

        //         return <div className="text-right">{valueFormatted}</div>;
        //     },
        // },
        // {
        //     id: "investValue24",
        //     accessorKey: "investValue24",
        //     header: ({ column }) => (
        //         <TableHeaderSorting
        //             align="right"
        //             header_name={"Invest Amount(24h)"}
        //             column={column}
        //         />
        //     ),
        //     cell: ({ row }) => {
        //         const valueFormatted = prettifyCurrencys(
        //             row.original.investValue24
        //         );

        //         return <div className="text-right">{valueFormatted}</div>;
        //     },
        // },
        // {
        //     id: "actions",
        //     cell: ({ row }) => {
        //         return (
        //             <div className="text-right">
        //                 <DropdownMenu>
        //                     <DropdownMenuTrigger asChild>
        //                         <Button variant="ghost" className="ml-auto  ">
        //                             <span className="sr-only">Open menu</span>
        //                             <IconWrapper icon_class_name="expand_more" />
        //                         </Button>
        //                     </DropdownMenuTrigger>
        //                     <DropdownMenuContent align="end">
        //                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
        //                         <DropdownMenuItem
        //                             onClick={() => {
        //                                 if (on_pool_click) {
        //                                     on_pool_click("invent",
        //                                         // @ts-ignore
        //                                         row.original.id
        //                                     );
        //                                 }
        //                             }}
        //                         >
        //                             <IconWrapper
        //                                 icon_class_name="swap_horiz"
        //                                 class_name="mr-2"
        //                             />{" "}
        //                             Invent
        //                         </DropdownMenuItem>
        //                     </DropdownMenuContent>
        //                 </DropdownMenu>
        //             </div>
        //         );
        //     },
        // },
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
                        No results.
                    </TableCell>
                </TableRow>
            ),
    });

    return (
        <>
            {contextHolder}
            <Spin spinning={spinning} fullscreen indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} size="large" />
            <div>
                <Tooltip placement="right" title={text}>
                    <Button
                        className="newButton mx-2"
                        onClick={collectCommission}
                    >Collect</Button>
                </Tooltip></div>
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
                {!is_over && (
                    <Pagination className="select-none">
                        <PaginationContent>
                            <PaginationItem
                                disabled={pagination.page_number === 1}
                                onClick={() => {
                                    handlePagination(pagination.page_number - 1);
                                }}
                            >
                                <PaginationPrevious />
                            </PaginationItem>
                            {pagination.page_number > 1 && (
                                <PaginationItem
                                    onClick={() => {
                                        handlePagination(pagination.page_number - 1);
                                    }}
                                >
                                    <PaginationLink>
                                        {pagination.page_number - 1}
                                    </PaginationLink>
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationLink isActive>
                                    {pagination.page_number}
                                </PaginationLink>
                            </PaginationItem>
                            {hasMore && (
                                <PaginationItem
                                    onClick={() => {
                                        handlePagination(pagination.page_number + 1);
                                    }}
                                >
                                    <PaginationLink>
                                        {pagination.page_number + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            )}
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem
                                disabled={!hasMore}
                                onClick={() => {
                                    handlePagination(pagination.page_number + 1);
                                }}
                            >
                                <PaginationNext />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </>
    );
};

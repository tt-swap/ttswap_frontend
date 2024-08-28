import { type Option, None, Some } from "@/utils/option";
import { type walletPool } from "@/utils/types/XykServiceTypes";
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
import { type XYKWalletPositionsListViewProps } from "@/utils/types/organisms.types";
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

import { myInvestGoodsDatas } from '@/graphql/account';
import { prettifyCurrencys, prettifyCurrencysFee } from '@/graphql/util';

export const XYKWalletPositionsListView: React.FC<XYKWalletPositionsListViewProps> = ({
    chain_name,
    dex_name,
    on_pool_click,
    page_size, wallet_address, value_good_id, data_num, is_over, chain_id
}) => {
    const { covalentClient } = useGoldRush();

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

    const handlePagination = (page_number: number) => {
        setPagination((prev) => {
            return {
                ...prev,
                page_number,
            };
        });
    };

    useEffect(() => {
        (async () => {
            setResult(None);
            let response: any;
            try {
                response =
                    // @ts-ignore
                    await myInvestGoodsDatas({ id: value_good_id, address: wallet_address, pageNumber: pagination.page_number - 1, pageSize: page_size }, chain_id);
                console.log(response, value_good_id)
                setHasMore(response.pagination.has_more);
                setError({ error: false, error_message: "" });
                setResult(new Some(response.items));
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


    const columns: ColumnDef<walletPool>[] = [

        {
            id: "id",
            accessorKey: "id",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Proof No"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="text-left">
                        {// @ts-ignore
                            row.original.id}
                    </div>
                );
            },
        },
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
                                    className=""
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
            id: "totalInvestValue",
            accessorKey: "totalInvestValue",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Market Value"}
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
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Invest Quanity"}
                    column={column}
                />
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
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Unit Fee"}
                    column={column}
                />
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
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Profit"}
                    column={column}
                />
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
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Earning Rate"}
                    column={column}
                />
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
            cell: ({ row }) => {
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="ml-auto  ">
                                    <span className="sr-only">Open menu</span>
                                    <IconWrapper icon_class_name="expand_more" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                {/* <DropdownMenuItem
                                    onClick={() => {
                                        if (on_pool_click) {
                                            on_pool_click("invest");
                                        }
                                    }}
                                >
                                    Invest
                                </DropdownMenuItem> */}
                                <DropdownMenuItem
                                    onClick={() => {
                                        if (on_pool_click) {
                                            // @ts-ignore
                                            on_pool_click(row.original.id);
                                        }
                                    }}
                                >
                                    {/* <IconWrapper
                                        icon_class_name="swap_horiz"
                                        class_name="mr-2"
                                    />{" "} */}
                                    Divest
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    const mobile_columns: ColumnDef<walletPool>[] = [
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
                );
            },
        },
        {
            id: "totalInvestValue",
            accessorKey: "totalInvestValue",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Value"}
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
            id: "earningRate",
            accessorKey: "earningRate",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Earning Rate"}
                    column={column}
                />
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
                            parseFloat(row.original.earningRate) > 0 &&
                            "text-green-600"
                            }`}
                    >
                        {valueFormatted}
                    </div>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="ml-auto  ">
                                    <span className="sr-only">Open menu</span>
                                    <IconWrapper icon_class_name="expand_more" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                {/* <DropdownMenuItem
                                    onClick={() => {
                                        if (on_pool_click) {
                                            on_pool_click("invest");
                                        }
                                    }}
                                >
                                    Invest
                                </DropdownMenuItem> */}
                                <DropdownMenuItem
                                    onClick={() => {
                                        if (on_pool_click) {
                                            // @ts-ignore
                                            on_pool_click(row.original.id);
                                        }
                                    }}
                                >
                                    {/* <IconWrapper
                                        icon_class_name="swap_horiz"
                                        class_name="mr-2"
                                    />{" "} */}
                                    Divest
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                        No results.
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
    );
};

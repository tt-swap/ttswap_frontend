import { type Option, None, Some } from "@/utils/option";
import { type ExchangeTransaction } from "@/utils/types/XykServiceTypes";
import { useEffect, useState } from "react";
import { POOL_TRANSACTION_MAP } from "@/utils/constants/shared.constants";
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
import { Badge } from "@/components/ui/badge";
import { timestampParser } from "@/utils/functions";
import { Button } from "@/components/ui/button";
import { TableHeaderSorting } from "@/components/ui/tableHeaderSorting";
import { IconWrapper } from "@/components/Shared";
import { useGoldRush } from "@/utils/store";
import { type XYKWalletTransactionsListViewProps } from "@/utils/types/organisms.types";
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

import { myTransactionsDatas } from '@/graphql/account';
import { prettifyCurrencys } from '@/graphql/util';

export const XYKWalletTransactionsListView: React.FC<XYKWalletTransactionsListViewProps> = ({
    chain_name,
    dex_name,
    on_transaction_click,
    on_native_explorer_click,
    on_goldrush_receipt_click,
    page_size, wallet_address, value_good_id, data_num, is_over,chain_id
}) => {
    const { covalentClient } = useGoldRush();

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
                    await myTransactionsDatas({ id: value_good_id, address:wallet_address, pageNumber: pagination.page_number - 1, pageSize: page_size },chain_id);
                console.log(response)
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
    }, [chain_name, dex_name, pagination, value_good_id,wallet_address,data_num]);

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
                        header_name={"Time"}
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
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Type"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                // @ts-ignore
                const token_0 = row.original.symbol1;
                // @ts-ignore
                const token_1 = row.original.symbol2;

                // if (row.original.type !== "SWAP") {
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
                            {// @ts-ignore
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
            id: "totalValue",
            accessorKey: "totalValue",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Market Value"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                // @ts-ignore
                return <>{prettifyCurrencys(row.original.totalValue)}{" "}{row.original.valueSymbol}</>;
            },
        },
        {
            id: "fromgoodQuanity",
            accessorKey: "fromgoodQuanity",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Goods1 Quantity"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                // @ts-ignore
                return (<span>{prettifyCurrencys(row.original.fromgoodQuanity)}{" "}{row.original.symbol1}</span>);
            },
        },
        {
            id: "togoodQuantity",
            accessorKey: "togoodQuantity",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Goods2 Quantity"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                // @ts-ignore
                const name = prettifyCurrencys(row.original.togoodQuantity) + " " + row.original.symbol2;
                return (<span>{// @ts-ignore
                    row.original.symbol2 === "#" ? "-" : name}</span>);
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                if (!on_native_explorer_click && !on_goldrush_receipt_click)
                    return;
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
                                {on_native_explorer_click && (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            on_native_explorer_click(
                                                row.original.hash
                                            );
                                        }}
                                    >
                                        <IconWrapper
                                            icon_class_name="open_in_new"
                                            class_name="mr-2"
                                        />{" "}
                                        Hash
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
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
                        header_name={"Time"}
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
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Type"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                // @ts-ignore
                const token_0 = row.original.symbol1;
                // @ts-ignore
                const token_1 = row.original.symbol2;

                // if (row.original.type !== "SWAP") {
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
                            {// @ts-ignore
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
            id: "totalValue",
            accessorKey: "totalValue",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Value"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                // @ts-ignore
                return <>{prettifyCurrencys(row.original.totalValue)}{" "}{row.original.valueSymbol}</>;
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                if (!on_native_explorer_click && !on_goldrush_receipt_click)
                    return;
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
                                {on_native_explorer_click && (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            on_native_explorer_click(
                                                row.original.hash
                                            );
                                        }}
                                    >
                                        <IconWrapper
                                            icon_class_name="open_in_new"
                                            class_name="mr-2"
                                        />{" "}
                                        Hash
                                    </DropdownMenuItem>
                                )}
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

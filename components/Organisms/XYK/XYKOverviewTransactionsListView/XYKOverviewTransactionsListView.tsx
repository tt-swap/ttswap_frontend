import { type Option, None, Some } from "@/utils/option";
import { type ExchangeTransaction } from "@/utils/types/XykServiceTypes";
import { POOL_TRANSACTION_MAP } from "@/utils/constants/shared.constants";
import { Fragment, useEffect, useState } from "react";
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
import { timestampParser } from "@/utils/functions";
import { Badge } from "@/components/ui/badge";
import { TableHeaderSorting } from "@/components/ui/tableHeaderSorting";
import { type XYKOverviewTransactionsListViewProps } from "@/utils/types/organisms.types";
import { useGoldRush } from "@/utils/store";
import { SkeletonTable } from "@/components/ui/skeletonTable";
import { transactionsDatas } from '@/graphql/overview';
import { prettifyCurrencys } from '@/graphql/util';
import { IconWrapper } from "@/components/Shared";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const XYKOverviewTransactionsListView: React.FC<
    XYKOverviewTransactionsListViewProps
> = ({
    chain_name,
    dex_name,
    on_transaction_click,
    on_native_explorer_click,
    on_goldrush_receipt_click,value_good_id,is_over
}) => {
        const { covalentClient } = useGoldRush();

        const [sorting, setSorting] = useState<SortingState>([
            {
                id: "time",
                desc: true,
            },
        ]);
        const [rowSelection, setRowSelection] = useState({});
        const [maybeResult, setResult] =
            useState<Option<ExchangeTransaction[]>>(None);
        const [error, setError] = useState({ error: false, error_message: "" });

        useEffect(() => {
            setResult(None);
            (async () => {
                let response;
                try {
                    response =
                        // @ts-ignore
                        // await covalentClient.XykService.getTransactionsForDex(
                        //     chain_name,
                        //     dex_name
                        // );
                        await transactionsDatas(value_good_id);
                    // @ts-ignore
                    setResult(new Some(response.items));
                    setError({ error: false, error_message: "" });
                } catch (error) {
                    setResult(new Some([]));
                    setError({
                        // @ts-ignore
                        error: response ? response.error : false, error_message: response ? response.error_message : "",
                    });
                }
            })();
        }, [dex_name, chain_name,value_good_id]);

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
                    
                    const token_0 = row.original.symbol1; const token_1 = row.original.symbol2;

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
                                {
                                // @ts-ignore
                                row.original.type}
                            </Badge>{" "}
                            {token_0}{" "}
                            {token_1 === "#" ? "" : "/"}{" "}
                            {token_1 === "#" ? "" : token_1}
                        </div>
                    );
                    // }
                    // const token_in =
                    //     handleExchangeType(row.original, 0) === "in"
                    //         ? token_0
                    //         : token_1;
                    // const token_out =
                    //     handleExchangeType(row.original, 0) === "out"
                    //         ? token_0
                    //         : token_1;
                    // return (
                    //     <div
                    //         className={
                    //             on_transaction_click
                    //                 ? "cursor-pointer hover:opacity-75"
                    //                 : ""
                    //         }
                    //         onClick={() => {
                    //             if (on_transaction_click) {
                    //                 on_transaction_click(row.original);
                    //             }
                    //         }}
                    //     >
                    //         <Badge
                    //             className="mr-2"
                    //             variant={
                    //                 POOL_TRANSACTION_MAP[row.original.act].color
                    //             }
                    //         >
                    //             {POOL_TRANSACTION_MAP[row.original.act].name}
                    //         </Badge>{" "}
                    //         {token_in.contract_ticker_symbol}{" "}
                    //         {row.original.act === "SWAP" ? "for" : "and"}{" "}
                    //         {token_out.contract_ticker_symbol}
                    //     </div>
                    // );
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
                id: "fromgoodQuanity",
                accessorKey: "fromgoodQuanity",
                header: ({ column }) => (
                    <TableHeaderSorting
                        align="left"
                        header_name={"Goods1 Amount"}
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
                        header_name={"Goods2 Amount"}
                        column={column}
                    />
                ),
                cell: ({ row }) => {
                    // @ts-ignore
                    const name = prettifyCurrencys(row.original.togoodQuantity) +" "+ row.original.symbol2;
                    // @ts-ignore
                    return (<span>{row.original.symbol2 === "#" ? "-" : name}</span>);
                },
            },
            // {
            //     id: "fromgoodQuanity",
            //     accessorKey: "fromgoodQuanity",
            //     header: ({ column }) => (
            //         <TableHeaderSorting
            //             align="left"
            //             header_name={"Token Amount"}
            //             column={column}
            //         />
            //     ),
            //     cell: ({ row }) => {
            //         if (row.original.act !== "SWAP") {
            //             return (
            //                 <span>
            //                     {handleTokenTransactions(
            //                         row.original.act,
            //                         "0",
            //                         row.original,
            //                         row.original.token_0.contract_decimals
            //                     )}{" "}
            //                     {row.original.token_0.contract_ticker_symbol}
            //                 </span>
            //             );
            //         }
            //         const token_in =
            //             handleExchangeType(row.original, 0) === "in" ? "0" : "1";
            //         return (
            //             <span>
            //                 {handleTokenTransactions(
            //                     row.original.act,
            //                     token_in,
            //                     row.original,
            //                     row.original[`token_${token_in}`].contract_decimals
            //                 )}{" "}
            //                 {
            //                     row.original[`token_${token_in}`]
            //                         .contract_ticker_symbol
            //                 }
            //             </span>
            //         );
            //     },
            // },
            // {
            //     id: "amount_1",
            //     accessorKey: "amount_1",
            //     header: ({ column }) => (
            //         <TableHeaderSorting
            //             align="left"
            //             header_name={"Token Amount"}
            //             column={column}
            //         />
            //     ),
            //     cell: ({ row }) => {
            //         if (row.original.act !== "SWAP") {
            //             return (
            //                 <span>
            //                     {handleTokenTransactions(
            //                         row.original.act,
            //                         "1",
            //                         row.original,
            //                         row.original.token_1.contract_decimals
            //                     )}{" "}
            //                     {row.original.token_1.contract_ticker_symbol}
            //                 </span>
            //             );
            //         }
            //         const token_in =
            //             handleExchangeType(row.original, 0) === "out" ? "0" : "1";
            //         const token_amount = handleTokenTransactions(
            //             row.original.act,
            //             token_in,
            //             row.original,
            //             row.original[`token_${token_in}`].contract_decimals
            //         );
            //         return (
            //             <span>
            //                 {token_amount}{" "}
            //                 {
            //                     row.original[`token_${token_in}`]
            //                         .contract_ticker_symbol
            //                 }
            //             </span>
            //         );
            //     },
            // },
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
                                                on_native_explorer_click(row.original.hash);
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
            columns,
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
            None: () => <SkeletonTable cols={4} />,
            Some: () => {
                return error.error ? (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                        >
                            {error.error_message}
                        </TableCell>
                    </TableRow>
                ) : !error.error && table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => {
                        return (
                            <Fragment key={row.id}>
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
                            </Fragment>
                        );
                    })
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                        >
                            No results.
                        </TableCell>
                    </TableRow>
                );
            },
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
            </div>
        );
    };

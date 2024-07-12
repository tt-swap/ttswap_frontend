import { type Option, None, Some } from "@/utils/option";
import {
    type UniswapLikeBalanceItem,
    prettifyCurrency,
    calculatePrettyBalance,
} from "@covalenthq/client-sdk";
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
import { SkeletonTable } from "@/components/ui/skeletonTable";
import { calculateFeePercentage } from "@/utils/functions/calculate-fees-percentage";

import { myInvestGoodsDatas } from '@/graphql/account';
import { prettifyCurrencys } from '@/graphql/util';

export const XYKWalletPositionsListView: React.FC<
    XYKWalletPositionsListViewProps
> = ({ chain_name, dex_name, on_pool_click, wallet_address, value_good_id, data_num }) => {
    const { covalentClient } = useGoldRush();

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "total_liquidity_quote",
            desc: true,
        },
    ]);
    const [rowSelection, setRowSelection] = useState({});
    const [maybeResult, setResult] =
        useState<Option<UniswapLikeBalanceItem[]>>(None);
    const [error, setError] = useState({ error: false, error_message: "" });

    useEffect(() => {
        (async () => {
            setResult(None);
            let response;
            try {
                response = await myInvestGoodsDatas(wallet_address, value_good_id);
                setError({ error: false, error_message: "" });
                // @ts-ignore
                setResult(new Some(response.items));
            } catch (exception) {
                setResult(new Some([]));
                // @ts-ignore
                setError({ error: response ? response.error : false, error_message: response ? response.error_message : "", });
            }
        })();
    }, [chain_name, dex_name, wallet_address, data_num, value_good_id]);

    const columns: ColumnDef<UniswapLikeBalanceItem>[] = [

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
                        header_name={"Goods"}
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
            id: "symbol",
            accessorKey: "symbol",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Symbol"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="text-right">
                        {// @ts-ignore
                            row.original.symbol}
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
                    header_name={"Proof Value"}
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
                const valueFormatted = prettifyCurrencys(
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
                const valueFormatted = prettifyCurrencys(
                    // @ts-ignore
                    row.original.profit
                );

                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "APY",
            accessorKey: "APY",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"APY"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const valueFormatted = calculateFeePercentage(
                    // @ts-ignore
                    +row.original.APY
                );

                return (
                    <div
                        className={`text-right ${
                            // @ts-ignore
                            parseFloat(row.original.APY) > 0 &&
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
                                    disInvest
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
        columns: columns,
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
        None: () => <SkeletonTable cols={5} float="right" />,
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
        </div>
    );
};

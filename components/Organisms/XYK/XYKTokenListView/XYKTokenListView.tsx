import { type Option, None, Some } from "@/utils/option";
import { type TokenV2Volume } from "@/utils/types/XykServiceTypes";
import { useEffect, useState, useMemo } from "react";
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
import { type XYKTokenListViewProps } from "@/utils/types/organisms.types";
import { SkeletonTable } from "@/components/ui/skeletonTable";
import { investGoodsDatas } from '@/graphql/overview';
import { prettifyCurrencys, prettifyCurrencysFee } from '@/graphql/util';
import { calculateFeePercentage } from "@/utils/functions/calculate-fees-percentage";

export const XYKTokenListView: React.FC<XYKTokenListViewProps> = ({
    chain_name,
    dex_name,
    on_token_click,
    page_size, value_good_id, chain_id
}) => {

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "currentValue",
            desc: true,
        },
    ]);
    const [rowSelection, setRowSelection] = useState({});
    const [maybeResult, setResult] = useState<Option<TokenV2Volume[]>>(None);
    const [error, setError] = useState({ error: false, error_message: "" });
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [pagination, setPagination] = useState({
        page_number: 1,
    });
    const [hasMore, setHasMore] = useState<boolean>(false);
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
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [hasMore, pagination]);
    // console.log("pafas:", pagination,hasMore)
    useEffect(() => {
        (async () => {
            setSpinning(true);
            // setResult(None);
            let response: any;
            try {
                response =
                    await investGoodsDatas({
                        id: value_good_id,
                        pageNumber: pagination.page_number - 1,
                        pageSize: page_size,
                    }, chain_id);
                // console.log(response, "***");
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
    }, [chain_name, dex_name, pagination, value_good_id]);

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

    const columns: ColumnDef<TokenV2Volume>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: () => (
                <div className="ml-4">
                    {t('body.home.goods.table.name')}
                </div>
            ),
            cell: ({ row }) => {
                // console.log(row,"((((")
                return (
                    <a
                        className="cursor-pointer hover:opacity-75"
                        onClick={() => {
                            if (on_token_click) {
                                on_token_click("goods/" + row.original.id, row.original.id);
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
                    {t('body.home.goods.table.price')}
                </div>
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencys(row.original.price);

                return <div className="text-right">{valueFormatted}{" "}{row.original.valueSymbol}</div>;
            },
        },
        {
            id: "price_24h",
            accessorKey: "price_24h",
            header: () => (
                <div className="text-right">
                    {t('body.home.goods.table.24h')}
                </div>
            ),
            cell: ({ row }) => {
                const valueFormatted = calculateFeePercentage(row.original.priceC_24h);
                return (
                    <div
                        className={`text-right ${parseFloat(row.original.priceC_24h) > 0 ?
                            "text-green-600" : "text-red-600"
                            }`}
                    >
                        {valueFormatted}
                    </div>
                );
            },
        },
        {
            id: "unitFee",
            accessorKey: "unitFee",
            header: () => (
                <div className="text-right">
                    {t('body.home.goods.table.unitfee')}
                </div>
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencysFee(row.original.unitFee);
                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "apy",
            accessorKey: "apy",
            header: () => (
                <div className="text-right">
                    {t('body.home.goods.table.apy')}
                </div>
            ),
            cell: ({ row }) => {
                const valueFormatted = calculateFeePercentage(row.original.apy);
                return (
                    <div
                        className={`text-right ${parseFloat(row.original.apy) > 0 ?
                            "text-green-600" : "text-red-600"
                            }`}
                    >
                        {valueFormatted}
                    </div>
                );
            },
        },
        {
            id: "currentValue",
            accessorKey: "currentValue",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={t('body.home.goods.table.volume')}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencys(row.original.currentValue);
                return (
                    <div className="text-right">{valueFormatted}{" "}{row.original.valueSymbol}</div>
                );
            },
        },
        {
            id: "actions",
            header: () => (
                <div className="text-right mr-4">
                    {t('body.home.goods.table.actions')}
                </div>
            ),
            cell: ({ row }) => {
                return (
                    <div className="text-right mr-4">
                        <Space>
                            <Button
                                // shape="round"
                                type="primary"
                                // size="small"
                                onClick={() => {
                                    on_token_click("swap", row.original.id);
                                }}
                            >
                                {t('body.home.goods.table.bnt')}
                            </Button>
                            <Button
                                // shape="round"
                                type="primary"
                                // size="small"
                                onClick={() => {
                                    on_token_click("invest", row.original.id);
                                }}
                            >
                                {t('body.home.goods.table.bnt1')}
                            </Button>
                        </Space>
                    </div>
                );
            },
        },
    ];

    const mobile_columns: ColumnDef<TokenV2Volume>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: ({ column }) => (
                <div className="ml-4">
                    {t('body.home.goods.table.name')}
                </div>
            ),
            cell: ({ row }) => {
                // console.log(row,"((((")
                return (
                    <a
                        className="cursor-pointer hover:opacity-75"
                        onClick={() => {
                            if (on_token_click) {
                                on_token_click("goods/" + row.original.id, row.original.id);
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
                    {t('body.home.goods.table.actions')}
                </div>
            ),
            cell: ({ row }) => {
                return (
                    <div className="text-right mr-4">
                        <Space>
                            <Button
                                // shape="round"
                                type="primary"
                                // size="small"
                                onClick={() => {
                                    on_token_click("swap", row.original.id);
                                }}
                            >
                                {t('body.home.goods.table.bnt')}
                            </Button>
                            <Button
                                // shape="round"
                                type="primary"
                                // size="small"
                                onClick={() => {
                                    on_token_click("invest", row.original.id);
                                }}
                            >
                                {t('body.home.goods.table.bnt1')}
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
        None: () => <SkeletonTable cols={5} float="right" />,
        Some: () =>
            error.error ? (
                <TableRow style={{}}>
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
                <TableHeader style={{ backgroundColor: "#f9f9f9" }}>
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

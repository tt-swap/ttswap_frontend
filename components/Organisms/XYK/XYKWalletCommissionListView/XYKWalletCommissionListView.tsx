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
import { Button } from 'antd';
import { TableHeaderSorting } from "@/components/ui/tableHeaderSorting";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { type XYKPoolListViewProps } from "@/utils/types/organisms.types";
import { SkeletonTable } from "@/components/ui/skeletonTable";
import { Tooltip, message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import useWallet from "@/hooks/useWallet";
import { useErrorMess } from '@/hooks/useErrorMess';

import { myCommissions } from '@/graphql/account';
import { prettifyCurrencys, prettifyCurrencysFee } from '@/graphql/util';

export const XYKWalletCommissionListView: React.FC<XYKPoolListViewProps> = ({
    chain_name,
    dex_name,
    on_pool_click,
    page_size, value_good_id, wallet_address, data_num, chain_id
}) => {
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "totalFeeQantity",
            desc: true,
        },
    ]);
    const [rowSelection, setRowSelection] = useState({});
    const [maybeResult, setResult] = useState<Option<Pool[]>>(None);
    const [collectIds, setCollectIds] = useState<[]>([]);
    const [error, setError] = useState({ error: false, error_message: "" });
    const [windowWidth, setWindowWidth] = useState<number>(0);
    const [pagination, setPagination] = useState({
        page_number: 1,
    });
    const [hasMore, setHasMore] = useState<boolean>();
    const [spinning, setSpinning] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [tableSpinning, settableSpinning] = useState(false);
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

    const { collect } = useWallet();

    const text = <span>{t('body.account.tabs.commission.tip')}</span>;

    const collectCommission = async () => {
        setSpinning(true);
        const isSuccess = await collect(collectIds);
        console.log(isSuccess)
        if (isSuccess === true) {
            messageApi.open({
                type: 'success',
                content: t('common.mess.collect') + t('common.mess.success'),
            });
        } else if (isSuccess === false) {
            messageApi.open({
                type: 'error',
                content: t('common.mess.collect') + t('common.mess.error'),
            });
        } else {
            messageApi.open({
              type: 'error',
              content: useErrorMess(isSuccess,t),
            });
          }
        setSpinning(false);
        document.body.style.overflow = "";

    }

    useEffect(() => {
        (async () => {
            settableSpinning(true);
            // setResult(None);
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
                console.log("myCommissions",response, value_good_id)
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
                setCollectIds(response.ids);
            } catch (exception) {
                setResult(new Some([]));
                setError({
                    error: response ? response.error : false,
                    error_message: response ? response.error_message : "",
                });
            }
            settableSpinning(false);
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
                    {t('body.account.tabs.commission.name')}
                </div>
            ),
            cell: ({ row }) => {
                return (
                    <div className="ml-4 flex items-center gap-3">
                        <TokenAvatar
                            size={GRK_SIZES.EXTRA_SMALL}
                            // @ts-ignore
                            token_url={row.original.logo_url}
                        />
                        <div className="flex flex-col">
                            {on_pool_click ? (
                                <a
                                    className="cursor-pointer hover:opacity-75"
                                    onClick={() => {
                                        if (on_pool_click) {
                                            on_pool_click("goods/" + row.original.id, row.original.id);
                                        }
                                    }}
                                >
                                    <span style={{ fontWeight: "600", paddingRight: "5px" }}>{row.original.name ? row.original.name : ""}</span>
                                    <span style={{ color: "#999" }}>{row.original.symbol ? row.original.symbol : ""}</span>
                                    {/* {
                                        // @ts-ignore
                                        row.original.name ? row.original.name : ""}{" "}{row.original.symbol} */}
                                </a>
                            ) : (
                                <label className="text-base">
                                    <span style={{ fontWeight: "600", paddingRight: "5px" }}>{row.original.name ? row.original.name : ""}</span>
                                    <span style={{ color: "#999" }}>{row.original.symbol ? row.original.symbol : ""}</span>
                                    {/* {
                                        // @ts-ignore
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
                    header_name=
                    {t('body.account.tabs.commission.totalfeevolume')}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencys(
                    row.original.totalFeeQantity
                );
                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "totalFeeAmount",
            accessorKey: "totalFeeAmount",
            header: () => (
                <div className="text-right">
                    {t('body.account.tabs.commission.totalfeeamount')}
                </div>
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencys(
                    row.original.totalFeeAmount
                );
                return <div className="text-right">{valueFormatted}{" "}{
                    row.original.valueSymbol}</div>;
            },
        },
        {
            id: "myFeeQuanity",
            accessorKey: "myFeeQuanity",
            header: () => (
                <div className="text-right">
                    {t('body.account.tabs.commission.feevolume')}
                </div>
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencysFee(row.original.myFeeQuanity);
                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "myFeeAmount",
            accessorKey: "myFeeAmount",
            header: () => (
                <div className="text-right mr-4">
                    {t('body.account.tabs.commission.feeamount')}
                </div>
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencysFee(
                    row.original.myFeeAmount
                );
                return <div className="text-right mr-4">{valueFormatted}{" "}{// @ts-ignore
                    row.original.valueSymbol}</div>;
            },
        },
    ];

    const mobile_columns: ColumnDef<Pool>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: () => (
                <div className="ml-4">
                    {t('body.account.tabs.commission.name')}
                </div>
            ),
            cell: ({ row }) => {
                return (
                    <div className="ml-4 flex items-center gap-3">
                        <TokenAvatar
                            size={GRK_SIZES.EXTRA_SMALL}
                            // @ts-ignore
                            token_url={row.original.logo_url}
                        />
                        <div className="flex flex-col">
                            {on_pool_click ? (
                                <a
                                    className="cursor-pointer hover:opacity-75"
                                    onClick={() => {
                                        if (on_pool_click) {
                                            on_pool_click("goods/" + row.original.id, row.original.id);
                                        }
                                    }}
                                >
                                    <span style={{ fontWeight: "600", paddingRight: "5px" }}>{row.original.name ? row.original.name : ""}</span>
                                    <span style={{ color: "#999" }}>{row.original.symbol ? row.original.symbol : ""}</span>
                                    {/* {
                                        // @ts-ignore
                                        row.original.name ? row.original.name : ""}{" "}{row.original.symbol} */}
                                </a>
                            ) : (
                                <label className="text-base">
                                    <span style={{ fontWeight: "600", paddingRight: "5px" }}>{row.original.name ? row.original.name : ""}</span>
                                    <span style={{ color: "#999" }}>{row.original.symbol ? row.original.symbol : ""}</span>
                                    {/* {
                                        // @ts-ignore
                                        row.original.name ? row.original.name : ""}{" "}{row.original.symbol} */}
                                </label>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            id: "myFeeQuanity",
            accessorKey: "myFeeQuanity",
            header: () => (
                <div className="text-right">
                    {t('body.account.tabs.commission.feevolume')}
                </div>
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencys(row.original.myFeeQuanity);
                return <div className="text-right">{valueFormatted}</div>;
            },
        },
        {
            id: "myFeeAmount",
            accessorKey: "myFeeAmount",
            header: () => (
                <div className="text-right">
                    {t('body.account.tabs.commission.feeamount')}
                </div>
            ),
            cell: ({ row }) => {
                const valueFormatted = prettifyCurrencys(
                    row.original.myFeeAmount
                );
                return <div className="text-right">{valueFormatted}{" "}{// @ts-ignore
                    row.original.valueSymbol}</div>;
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
        <>
            {contextHolder}
            <Spin spinning={spinning} fullscreen indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} size="large" />
            <div className="mb-4">
                <Tooltip placement="right" title={text}>
                    <Button
                        size="large"
                        // shape="round"
                        type="primary"
                        className="mx-2"
                        onClick={collectCommission}
                        disabled={collectIds.length>0?false:true}
                    >
                    {t('body.account.tabs.commission.bnt')}</Button>
                </Tooltip>
            </div>
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
                        spinning={tableSpinning}
                        indicator={<LoadingOutlined spin />}
                        tip="Loading"
                    // size="small"
                    >
                        <div />
                    </Spin>
                </div>
            </div>
        </>
    );
};

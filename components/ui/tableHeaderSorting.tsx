import { type Column } from "@tanstack/react-table";
import { IconWrapper } from "../Shared";
import { Tooltip } from 'antd';

export interface TableHeaderSortingProps {
    header_name: string;
    column: Column<any, unknown>;
    align: "left" | "right" | "center";
    icon?: boolean;
    // text: string;
}

export const TableHeaderSorting = ({
    header_name,
    column,
    align,
    icon = true,
    // text
}: TableHeaderSortingProps) => {
    const sortedIcon =
        column.getIsSorted() === "asc"
            ? "arrow_drop_up"
            : column.getIsSorted() === "desc"
              ? "arrow_drop_down"
              : "sort";
    return (
        // <Tooltip placement="top" title={text}>
        <div
            className={`flex cursor-pointer items-center gap-1 whitespace-nowrap hover:text-slate-900 dark:hover:text-slate-50  ${
                align === "right"
                    ? "justify-end"
                    : align === "center"
                      ? "justify-center"
                      : ""
            }`}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {header_name}
            {icon && (
                <IconWrapper
                    icon_size={sortedIcon === "sort" ? "text-base" : ""}
                    class_name="transition-all "
                    icon_class_name={sortedIcon}
                />
            )}
        </div>
            
            // </Tooltip>
    );
};

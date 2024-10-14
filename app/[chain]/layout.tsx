"use client"
import { Flex } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css"
interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <Flex
            direction="column"
            gap="5"
            className="container min-h-[calc(100vh-150px)] py-8"
        >
            {children}
        </Flex>
    )
}

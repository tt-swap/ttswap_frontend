"use client"
// import { useContext, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Flex } from "@radix-ui/themes"
import "@radix-ui/themes/styles.css"
import { useTheme } from "next-themes"

interface DashboardLayoutProps {
    children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const router = useRouter()
    const pathname = usePathname()
    const pathRegex = pathname.match(/\/([^\/]*)$/)
    const path = pathRegex ? pathRegex[1] : pathname
    // const { setTheme, theme } = useTheme()

    // console.log(pathname, "========", pathRegex, "****", path)
    // useEffect(()=>{
    //   console.log("dark:", path);
    //   setTheme("dark");
    //   return ()=>{
    //     setTheme("dark");
    //   }
    // },[path])

    const handleTabSwitch = (route: string) => {
        const routeSegments = pathname.split('/');
        routeSegments[3] = route;
        if (routeSegments.length > 4) {
            routeSegments.pop();
        }
        const newRoute = routeSegments.join('/');
        console.log(newRoute)
        router.push(newRoute);
    }

    return (
        <Flex
            direction="column"
            gap="5"
            className="container min-h-[calc(100vh-150px)] py-8"
        >
            <Tabs value={path} className="w-full ">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger
                        value="overview"
                        onClick={() => {
                            handleTabSwitch("overview")
                        }}
                    >
                        Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="goods"
                        onClick={() => {
                            handleTabSwitch("goods")
                        }}
                    >
                        Goods
                    </TabsTrigger>
                    <TabsTrigger
                        value="pools"
                        onClick={() => {
                            handleTabSwitch("pools")
                        }}
                    >
                        Pools
                    </TabsTrigger>
                    <TabsTrigger
                        value="account"
                        onClick={() => {
                            handleTabSwitch("account")
                        }}
                    >
                        Account
                    </TabsTrigger>
                    <TabsTrigger
                        value="swap"
                        onClick={() => {
                            handleTabSwitch("swap")
                        }}
                    >
                        Swap
                    </TabsTrigger>
                    <TabsTrigger
                        value="invest"
                        onClick={() => {
                            handleTabSwitch("invest")
                        }}
                    >
                        Invest
                    </TabsTrigger>
                </TabsList>
            </Tabs>
            {children}
        </Flex>
    )
}

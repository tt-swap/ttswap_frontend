'use client'

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();
    const pathname = usePathname();
    const routeSegments = pathname.split('/');

    useEffect(() => {
        if (typeof window !== "undefined") {
            const value = "sepolia";
            const address = "ttswap";
            const name = "goods";

            // 检查当前路由是否已经符合预期格式
            if (routeSegments[1] === value && routeSegments[2] === address && routeSegments[3] === name && routeSegments.length <= 5) {
                return; // 如果已经符合预期格式，不进行重定向
            }

            // 构建新的路由
            const newRouteSegments = [
                '',
                value,
                address,
                name,
                ...routeSegments.slice(4, 5) // 保留第5个段（如果存在）
            ];
            const newRoute = newRouteSegments.join('/');

            // 只有在新路由与当前路由不同时才进行重定向
            if (newRoute !== pathname) {
                router.replace(newRoute);
            }
        }
    }, [router, pathname, routeSegments]);

    return null;
}
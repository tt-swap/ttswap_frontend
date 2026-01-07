
import { useRoutes, useLocation } from 'react-router-dom'
import routes from './routes'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'

const RouterView = () => {
  const { i18n } = useTranslation()
  const currentRoutes = routes(i18n)
  const routing = useRoutes(currentRoutes)
  const location = useLocation()

  // 根据当前路由设置页面标题
  useEffect(() => {
    let matchedRoute = null

    // 精确匹配
    matchedRoute = currentRoutes.find(route => location.pathname === route.path)

    // 如果没有精确匹配，尝试匹配动态路由
    if (!matchedRoute) {
      matchedRoute = currentRoutes.find(route => {
        if (!route.path || !route.path.includes(':')) return false

        // 将路由路径转换为正则表达式
        // 例如: /tokens/:tokens_id -> /^\/tokens\/[^\/]+$/
        const routeRegex = new RegExp('^' + route.path.replace(/:[^/]+/g, '[^/]+') + '$')
        return routeRegex.test(location.pathname)
      })
    }

    if (matchedRoute && matchedRoute.title) {
      document.title = matchedRoute.title
    } else {
      document.title = 'TTswap'
    }
  }, [location, currentRoutes])

  return routing
}

export default RouterView

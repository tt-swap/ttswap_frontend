
import { usePathname } from "next/navigation"


export const handleTabSwitch = (route: string,pathname:string) => {
    // const router = useRouter()
    // const pathname = usePathname()
    const routeSegments = pathname.split('/');
    routeSegments[3] = route;
    if(routeSegments.length > 4){
      routeSegments.pop();
    }
    const newRoute = routeSegments.join('/');
    // router.push(newRoute);
//   console.log(newRoute,8888)
    return newRoute;
  }


  export const getString = (str: string): string | null => {
    const index = str.indexOf('?');
    if (index === -1) {
        return null; // 如果未找到"?"，则返回null
    }
    return str.substring(index + 1); // 返回"?"之后的所有字符
}
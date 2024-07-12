
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
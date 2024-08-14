import { useEffect } from "react";
import TokenSwap from "./TokenSwap";
import { cleanupImgCache } from "@/utils/icon";

function App() {
  useEffect(() => {
    return () => {
      // global clean up when unmount
      cleanupImgCache()
    }
  }, [])
  // return <TokenSwap />;
}

export default App;

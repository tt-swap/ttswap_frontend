import { useEffect } from "react";
import TokenSwap from "./TokenSwap";
import usePrices from "@/hooks/usePrices";
import { cleanupImgCache } from "@/utils/icon";

function App() {
  const { getPrices } = usePrices();
  useEffect(() => {
    getPrices()
    return () => {
      // global clean up when unmount
      cleanupImgCache()
    }
  }, [])
  return <TokenSwap />;
}

export default App;

import { useEffect, useState } from "react";

export const useWindowSize = () => {
  const [windowSize] = useState({
    width: "",
    height: ""
  });

  useEffect(() => {
    const changeWindowSize = () => {
      // setWindowSize({ width: window?.innerWidth, height: window?.innerHeight });
    };
    window.addEventListener("resize", changeWindowSize);
    return () => window.removeEventListener("resize", changeWindowSize);
  }, []);

  const isMobile = false//windowSize.width <= theme.breakpoints.small;
  const isTablet = false//windowSize.width <= theme.breakpoints.medium;
  const isSmallScreen = false //windowSize.width <= theme.breakpoints.large;

  return { ...windowSize, isMobile, isTablet, isSmallScreen };
};

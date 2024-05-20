import React, { useEffect, useState } from "react";
import axios from "axios";

interface ImgCacheProps {
  src: string;
  alt: string;
  expiresInSeconds?: number;
  className: string
}
// @ts-ignore
const ImgCache: React.FC<ImgCacheProps> = ({
  src,
  alt,
  expiresInSeconds = 3600,
  className
}) => {
  const [imageData, setImageData] = useState<string | undefined>(undefined);

  useEffect(() => {
    const cacheKey = `imgCache_${src}`;
    const cachedData = localStorage.getItem(cacheKey);

    // Check if cached data exists and is not expired
    if (cachedData) {
      const { timestamp, data } = JSON.parse(cachedData);

      if (Date.now() - timestamp < expiresInSeconds * 1000) {
        setImageData(data);
        return;
      }
    }

    // Fetch the image or SVG if not in the cache or expired
    axios
      .get(src, { responseType: "blob" })
      .then((response) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setImageData(base64data);

          // Store the image data in the cache with a timestamp
          const cacheData = {
            timestamp: Date.now(),
            data: base64data,
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        };
        reader.readAsDataURL(response.data);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  }, [src, expiresInSeconds]);

  return imageData && <img className={className} src={imageData} alt={alt} />;
};

export default ImgCache;

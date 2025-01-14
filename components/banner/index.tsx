
import { useEffect, useState } from "react";
import { Carousel } from 'antd';
import i18n from '@/i18n/i18n';
import banner1 from "static/banner/christmas-banner.png";
import banner2 from "static/banner/christmas-banner-1.png";
import banneren1 from "static/banner/christmas-banner-en.png";
import banneren2 from "static/banner/christmas-banner-1-en.png";
import testBanner1 from "static/banner/test-banner1.png";
import testBanner2 from "static/banner/test-banner2.png";
import testBanneren1 from "static/banner/test-banner1en.png";
import testBanneren2 from "static/banner/test-banner2en.png";

const Banner = () => {
  const [lang, setLang] = useState('en');
  const [open, setopen] = useState(false);
  const [banner, setbanner] = useState({ b1: banner2, b2: banneren2 });

  useEffect(() => {
    setLang(i18n.language);
  }, [i18n.language]);

  const bannerOP = () => {
    if (open) {
      setopen(false)
    } else {
      setopen(true)
    }
  };

  const bannerV = (a: number) => {
    bannerOP();
    if (a === 1) {
      setbanner({ b1: banner2, b2: banneren2 })
    } else {
      setbanner({ b1: testBanner2, b2: testBanneren2 })
    }
    // console.log(open)
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', bannerOP);
    } else {
      document.removeEventListener('mousedown', bannerOP);
    }
    return () => {
      document.removeEventListener('mousedown', bannerOP);
    };
  }, [open]);
  return (
    <>
      <Carousel autoplay arrows>
        <div className="cursor-pointer"
          style={{ marginBottom: "3rem" }}
        >
          <img src={lang === 'zh' ? banner1.src : banneren1.src}
            onClick={() => {
              bannerV(1)
            }}
          />
        </div>
        <div className="cursor-pointer"
          style={{ marginBottom: "3rem" }}
        >
          <img src={lang === 'zh' ? testBanner1.src : testBanneren1.src}
            onClick={() => {
              bannerV(2)
            }}
          />
        </div>
      </Carousel>
      {open && (
        <div className="banner-open cursor-pointer">
          <img src={lang === 'zh' ? banner.b1.src : banner.b2.src}></img>
        </div>
      )}
    </>
  );
};

export default Banner;

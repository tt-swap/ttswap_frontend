import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation"
import { GithubOutlined, XOutlined, DiscordOutlined, MailOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import { Icons } from "@/components/icons";
import './footer.css';

export function Footer() {

  const [hmoe, setHmoe] = useState(false);
  const pathname = usePathname();
  const now = new Date();
  const year = now.getFullYear();
  useEffect(() => {
    const routeSegments = pathname.split('/');
    if (routeSegments[3] === "home") {
      setHmoe(true);
    } else {
      setHmoe(false);
    }
  }, [pathname]);

  return (
    <>
      {hmoe && (<><Divider />
        <div className="flex justify-between footer">
          <div className="flex gap-8 ico-eas">
            <a target="_blank" rel="noopener noreferrer" href="https://x.com/ttswapFinance">
              <XOutlined />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/XygqnmQgX3">
              <DiscordOutlined />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/@ttswap_official">
              <YoutubeOutlined />
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://t.me/ttswap01">
              <Icons.Telegram className="h-5 w-5" />
            </a>
          </div>
          <div style={{ fontSize: "12px" }}>
            <span>© {year} - TTSWAP </span>
          </div>
        </div></>)}
    </>
  );
}

import { useMemo } from "react";
import { TokenAvatar } from "./TokenAvatar";
import { type TokenAvatarProps, GRK_SIZES } from "@/types/common";

interface TokenIconProps {
  isValueToken?: boolean;
  icon: string;
  color?: string;
  size?: GRK_SIZES;
  showPulse?: boolean;
  className?: string;
}

/**
 * TokenIcon 组件 - 统一的代币图标渲染
 * 
 * @param isValueToken - 代币符号，用于判断是否为有价值代币
 * @param icon - 代币图标字符（emoji或符号）
 * @param color - 背景颜色
 * @param size - 尺寸：sm(16px), md(24px), lg(32px), xl(40px)
 * @param showPulse - 是否显示脉冲动画（仅对有价值代币生效）
 * @param className - 额外的CSS类名
 */
export function TokenIcon({
  isValueToken,
  icon,
  color,
  size = GRK_SIZES.SMALL,
  showPulse = true,
  className = "",
}: TokenIconProps) {

  // 尺寸配置
    const SIZE_CLASS = useMemo<string>(() => {
      switch (size) {
          case GRK_SIZES.EXTRA_EXTRA_SMALL:
              return "w-6 h-6";
          case GRK_SIZES.EXTRA_SMALL:
              return "w-8 h-8";
          case GRK_SIZES.SMALL:
              return "w-10 h-10";
          case GRK_SIZES.MEDIUM:
              return "w-12 h-12";
          case GRK_SIZES.LARGE:
              return "w-14 h-14";
          default:
              return "w-4 h-4";
      }
  }, [size]);

  return (
    <div className={`relative inline-flex p-1 ${className}`}>
      {/* 主图标 */}
      <div
        className={`${SIZE_CLASS} rounded-full flex items-center justify-center text-white font-medium transition-all duration-300 ${isValueToken && showPulse
            ? "ring-2 ring-yellow-400 ring-offset-2 shadow-lg shadow-yellow-400/40"
            : ""
          }`}
        style={{ backgroundColor: color ?? "" }}
      >
        <TokenAvatar
          token_url={icon}
          size={size}
          showPulse={showPulse}
        />
      </div>

      {/* 脉冲动画效果 - 仅对有价值代币显示 */}
      {isValueToken && showPulse && (
        <>
          {/* 外层脉冲 - 快速扩散 */}
          <div className="absolute inset-0.5 rounded-full border-2 border-yellow-400 opacity-75 animate-token-ping pointer-events-none"></div>

          {/* 中层脉冲 - 中速呼吸 */}
          <div className="absolute inset-0.5 rounded-full border border-yellow-300 opacity-50 animate-token-pulse pointer-events-none"></div>

          {/* 内层微光 - 慢速闪烁 */}
          <div className="absolute inset-1 rounded-full bg-yellow-400/10 animate-token-glow pointer-events-none"></div>
        </>
      )}
    </div>
  );
}

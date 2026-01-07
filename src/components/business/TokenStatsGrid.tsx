interface StatItem {
  label: string;
  value: React.ReactNode;
  subValue?: React.ReactNode;
}

interface TokenStatsGridProps {
  title: string;
  stats: StatItem[];
}

export function TokenStatsGrid({ title, stats }: TokenStatsGridProps) {
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-medium">{title}</h3>
      </div>
      <div className="p-4 sm:p-6">
        {/* 移动端：2列网格，平板端：3列，桌面端：6列 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center lg:text-left">
              <div className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                {stat.label}
              </div>
              <div className="text-sm sm:text-base font-medium mb-0">
                {stat.value}
              </div>
              {stat.subValue && (
                <div className="text-xs text-muted-foreground mt-1">
                  {stat.subValue}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

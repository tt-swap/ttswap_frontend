# 🚀 去中心化交易所 - 投资组合管理界面

一个现代化、模块化的加密货币投资组合管理系统，采用 React + TypeScript + Tailwind CSS 构建。

## ✨ 特性

### 核心功能
- 📊 **投资组合概览** - 实时查看投资数据、市场价值和收益情况
- 💱 **代币交易** - 支持代币兑换、质押、提现等操作
- 📈 **交易统计** - 详细的交易记录和数据分析
- 💰 **佣金管理** - 佣金记录和推荐人管理
- 🎯 **公开售卖** - 代币公售参与和记录查询

### 技术特性
- ⚡️ **模块化架构** - 19个精心设计的组件，清晰的职责划分
- 🎨 **统一设计系统** - 绿色主题，一致的视觉语言
- 📱 **响应式设计** - 完美支持桌面和移动端
- 🔧 **TypeScript** - 完整的类型安全
- 🎯 **高性能** - 优化的组件结构和代码拆分

---

## 📂 项目结构

```
/src/
├── components/           # 🎨 业务组件 (19个组件)
│   ├── business/        # 业务逻辑组件 (4个)
│   │   ├── PortfolioOverview.tsx      # 投资组合概览
│   │   ├── TokenProfile.tsx           # 代币资料详情
│   │   ├── TokenStatsGrid.tsx         # 代币统计网格
│   │   ├── TradingStatistics.tsx      # 交易统计
│   │   └─�� index.ts
│   ├── common/          # 通用组件 (2个)
│   │   ├── TokenIcon.tsx              # 代币图标
│   │   ├── TokenSelector.tsx          # 代币选择器
│   │   └── index.ts
│   ├── dialogs/         # 对话框组件 (4个)
│   │   ├── CreateTokenDialog.tsx      # 创建代币对话框
│   │   ├── SwapDialog.tsx             # 兑换对话框
│   │   ├── TokenSelectionDialog.tsx   # 代币选择对话框
│   │   ├── WithdrawDialog.tsx         # 提现对话框
│   │   └── index.ts
│   ├── layout/          # 布局组件 (3个)
│   │   ├── HeroSection.tsx            # 英雄区块
│   │   ├── MarketOverview.tsx         # 市场概览
│   │   ├── QuickActions.tsx           # 快捷操作
│   │   └── index.ts
│   └── tables/          # 表格组件 (5个)
│       ├── CommissionTable.tsx        # 佣金表格
│       ├── InvestmentTable.tsx        # 投资证明表格
│       ├── ReferralTable.tsx          # 推荐人表格
│       ├── TokenTable.tsx             # 代币表格
│       ├── TransactionRecords.tsx     # 交易记录表格
│       └── index.ts
│
├── pages/               # 📄 页面组件 (3个)
│   ├── PublicSale.tsx                 # 公开售卖页面
│   ├── TokenDetailPage.tsx            # 代币详情页面
│   ├── TradingPage.tsx                # 交易页面
│   └── index.ts
│
├── hooks/               # 🎣 自定义Hooks
│   └── useTokenData.ts                # 代币数据Hook
│
├── services/            # 🔌 API服务层
│   ├── apiClient.ts                   # API客户端
│   ├── index.ts
│   └── modules/
│       ├── investmentService.ts       # 投资服务
│       ├── tokenService.ts            # 代币服务
│       └── transactionService.ts      # 交易服务
│
├── store/               # 📦 状态管理
│   └── index.ts
│
├── types/               # 📝 TypeScript类型定义
│   └── index.ts
│
├── utils/               # 🛠️ 工具函数
│   ├── clipboard.ts                   # 剪贴板工具
│   ├── constants.ts                   # 常量定义
│   ├── format.ts                      # 格式化工具
│   └── mockData.ts                    # 模拟数据
│
└── styles/              # 🎨 样式文件
    ├── global.css                     # 全局样式
    └── variables.css                  # CSS变量

/components/             # 🎨 UI组件库
├── figma/              # Figma专用组件
│   └── ImageWithFallback.tsx
└── ui/                 # ShadCN UI组件 (50+个)
    ├── button.tsx, card.tsx, dialog.tsx...
    └── ...

/guidelines/             # 📖 设计规范
└── Guidelines.md

/docs/                   # 📚 项目文档
├── architecture/       # 架构文档
├── guides/            # 开发指南
└── refactoring/       # 重构记录
```

---

## 🎨 设计系统

### 颜色规范

#### 主色调 - 绿色系统
- **主色**: `#0fb981` - 主要按钮、链接
- **悬停色**: `#22c55e` - 交互状态
- **USDT专用**: `#26a17b` - USDT代币图标背景

#### 按钮样式
```tsx
// 主要按钮
className="bg-[#0fb981] hover:bg-[#22c55e] text-white border-0 shadow-sm"

// Ghost按钮
className="hover:bg-[#0fb981]/10 hover:text-[#0fb981]"

// 文字链接
className="text-[#0fb981] hover:text-[#22c55e]"
```

### 手续费单位
- 统一使用 **万分号（‱）** 显示所有手续费

### 特殊效果
- **USDT代币**: 金色脉冲光环动画
- **关联记录组**: 视觉连接线和分组效果
- **价值代币**: 特殊高亮和标识

---

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

---

## 📊 组件统计

| 类别 | 组件数量 | 说明 |
|------|---------|------|
| 页面组件 | 3 | PublicSale, TokenDetailPage, TradingPage |
| 业务组件 | 4 | PortfolioOverview, TokenProfile, TokenStatsGrid, TradingStatistics |
| 表格组件 | 5 | Investment, Token, Transaction, Commission, Referral |
| 对话框组件 | 4 | CreateToken, Swap, TokenSelection, Withdraw |
| 布局组件 | 3 | Hero, MarketOverview, QuickActions |
| 通用组件 | 2 | TokenIcon, TokenSelector |
| **总计** | **21** | **完整模块化组件** |

---

## 🔧 技术栈

### 核心框架
- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **路径别名** - `@/` 别名支持 ⭐
- **国际化 (i18n)** - 中英文双语支持 🌍

### UI组件库
- **ShadCN UI** - 基础组件库
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

### 数据可视化
- **Recharts** - 图表库

### 开发体验
- **路径别名系统** - 简化导入路径
  - `@components/*` - 业务组件
  - `@utils/*` - 工具函数
  - `@types/*` - 类型定义
  - [查看完整列表 →](./PATH_ALIAS_QUICK_REF.md)
- **国际化系统** 🌍 - 完整的多语言支持
  - 中文 (zh) 和 英文 (en)
  - 自动语言检测和持久化
  - 内置语言切换器组件
  - [查看使用指南 →](./I18N_SETUP_COMPLETE.md)

### 工具库
- **date-fns** - 日��处理
- **sonner** - Toast通知

---

## 📱 功能模块

### 1. 投资证明管理
- 独立记录显示（如USDT）
- 关联记录组（如WBTC-USDT、USDC-USDT）
- 投资数据统计
- 操作按钮（兑换、投资、提现）

### 2. 代币管理
- 代币列表展示
- 代币详情查看
- 代币创建功能
- 代币统计分析

### 3. 交易功能
- 代币兑换
- 流动性质押
- 资产提现
- 交易历史记录

### 4. 统计分析
- 交易统计概览
- 代币数据分析
- 收益计算展示

### 5. 佣金与推荐
- 佣金记录查询
- 推荐人管理
- 收益统计

### 6. 公开售卖
- 公售阶段展示
- 投资参与
- 记录查询

---

## 🎯 核心特性详解

### 投资证明表格特性
1. **独立记录**: 单独的代币投资（如纯USDT投资）
2. **关联记录组**: 组合投资（如WBTC-USDT配对）
   - 视觉分组效果
   - 连接线指示
   - 分组背景色
3. **USDT特效**: 
   - 金色脉冲光环动画
   - 特殊图标样式
   - 价值代币标识

### 手续费规范
- 所有费率使用 **万分号（‱）** 显示
- 买入费率：0.08‱
- 卖出费率：0.08‱
- 投资费率：0.20‱
- 提现费率：0.30‱

---

## 📖 开发指南

### 路径别名导入 ⭐ 推荐
```typescript
// ✅ 使用路径别名（推荐）
import { PublicSale, TokenDetailPage, TradingPage } from "@pages";
import { PortfolioOverview, TokenProfile } from "@components/business";
import { InvestmentTable, TokenTable } from "@components/tables";
import { CreateTokenDialog, SwapDialog } from "@components/dialogs";
import { formatCurrency, formatPercentage } from "@utils/format";
import { Button, Card } from "@legacy-components/ui/button";
import type { Token, Investment } from "@types";
```

### 传统导入方式（兼容）
```typescript
// ✅ 也可以使用（但不推荐）
import { PublicSale } from "./src/pages";
import { PortfolioOverview } from "./src/components/business";
import { Button } from "./components/ui/button";
```

📚 **完整指南**: [路径别名使用文档](./docs/guides/PATH_ALIAS_GUIDE.md)

### Tailwind动态颜色规范

**❌ 禁止使用**:
```typescript
// 动态插值会导致Tailwind无法编译
className={`text-[${COLORS.PRIMARY}]`}
```

**✅ 正确使用**:
```typescript
// 硬编码颜色值
className="text-[#0fb981]"

// 或使用条件表达式
className={isActive ? "text-[#0fb981]" : "text-gray-500"}
```

详见: `/guidelines/Guidelines.md`

---

## 📚 文档

- **架构文档**: `/docs/architecture/`
- **开发指南**: `/docs/guides/`
- **重构记录**: `/docs/refactoring/`
- **设计规范**: `/guidelines/Guidelines.md`

---

## 🎉 项目状态

✅ **100% 模块化重构完成**

- ✅ 21个组件完全模块化
- ✅ 统一的导入/导出系统
- ✅ 清晰的目录结构
- ✅ 完整的类型定义
- ✅ 文档体系完善

---

## 🔮 未来规划

### 短期目标
- [ ] 添加单元测试
- [ ] 实现React Router路由
- [ ] 添加懒加载优化
- [ ] 集成真实API

### 中期目标
- [ ] 添加状态管理（Zustand/Redux）
- [ ] 实现SSR（Next.js）
- [ ] 添加i18n国际化
- [ ] PWA支持

### 长期目标
- [ ] Web3钱包集成
- [ ] 智能合约交互
- [ ] 实时数据推送
- [ ] 移动端App

---

## 👨‍💻 开发者

本项目由 AI 辅助完成模块化重构，采用最佳实践和现代化架构。

## 📄 License

MIT

---

## 🙏 致谢

- ShadCN UI - 提供优秀的组件库
- Tailwind CSS - 强大的样式系统
- React 团队 - 卓越的前端框架

---

**享受开发！** 🚀

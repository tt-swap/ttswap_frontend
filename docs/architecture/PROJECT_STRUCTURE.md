# 项目结构说明

本文档详细介绍了去中心化交易所投资组合管理界面的项目结构和文件组织。

---

## 📁 目录结构概览

```
project-root/
├── App.tsx                    # 主应用组件
├── index.html                 # HTML入口文件
├── package.json              # 项目配置和依赖
├── vite.config.ts            # Vite构建配置
├── tsconfig.json             # TypeScript配置
├── README.md                 # 项目主文档
├── QUICK_START.md           # 快速开始指南
│
├── guidelines/               # 设计规范
│   └── Guidelines.md        # 颜色系统、按钮规范、Tailwind规范
│
├── docs/                    # 项目文档
│   ├── README.md           # 文档索引
│   ├── architecture/       # 架构文档
│   ├── guides/            # 开发指南
│   └── refactoring/       # 重构历史
│
├── src/                     # 新的模块化源代码
│   ├── components/         # 共享组件
│   │   └── common/        # TokenIcon、TokenSelector
│   ├── utils/             # 工具函数
│   │   ├── constants.ts   # 常量定义
│   │   ├── format.ts      # 格式化函数
│   │   ├── mockData.ts    # Mock数据生成
│   │   └── clipboard.ts   # 剪贴板工具
│   ├── types/             # TypeScript类型定义
│   ├── hooks/             # 自定义React Hooks
│   ├── services/          # API服务层
│   ├── store/             # 状态管理
│   └── routes/            # 路由配置
│
├── components/              # React业务组件
│   ├── ui/                # shadcn/ui基础组件
│   ├── InvestmentTable.tsx
│   ├── TokenTable.tsx
│   ├── SwapDialog.tsx
│   └── ...                # 其他业务组件
│
└── styles/                 # 全局样式
    └── globals.css        # Tailwind配置和自定义动画
```

---

## 📂 详细目录说明

### 根目录文件

#### App.tsx
- **作用**: 主应用组件，整个应用的入口
- **内容**: 
  - 标签页导航（投资证明、代币、交易统计等）
  - 路由管理
  - 全局状态管理
  - 主要页面布局

#### package.json
- **作用**: 项目配置文件
- **包含**:
  - 项目依赖列表
  - 构建脚本
  - 项目元信息

#### vite.config.ts
- **作用**: Vite构建工具配置
- **配置项**:
  - React插件
  - 路径别名
  - 构建优化选项

---

### src/ 目录（模块化源代码）

#### src/components/common/
共享的UI组件，可在多个业务组件中复用。

**TokenIcon.tsx**
- 统一的代币图标渲染组件
- 支持价值代币特效（金色光环）
- 可配置尺寸和样式

**TokenSelector.tsx**
- 代币选择器组件
- 包含搜索和筛选功能
- 用于SwapDialog、WithdrawDialog等

**使用示例**:
```tsx
import { TokenIcon } from '../src/components/common/TokenIcon';

<TokenIcon
  symbol="USDT"
  icon="₮"
  color="#26a17b"
  size="md"
  showValueEffect={true}
/>
```

#### src/utils/
工具函数和辅助方法。

**constants.ts**
- 全局常量定义
- 颜色系统 (COLORS)
- 价值代币列表 (VALUE_TOKENS)
- 其他配置常量

**format.ts**
- 数字格式化函数 (formatCurrency)
- 百分比格式化 (formatPercentage)
- 地址格式化 (formatAddress)

**mockData.ts**
- Mock数据生成器
- 用于开发和测试

**clipboard.ts**
- 剪贴板操作工具
- 复制文本功能

**使用示例**:
```tsx
import { formatCurrency } from '../src/utils/format';
import { COLORS, VALUE_TOKENS } from '../src/utils/constants';

const formatted = formatCurrency(1234.56); // "1,234.56"
const isValue = VALUE_TOKENS.includes('USDT'); // true
```

#### src/types/
TypeScript类型定义。

**index.ts**
- 统一的类型导出
- Token、Investment、Transaction等接口定义
- 确保类型安全

**使用示例**:
```tsx
import type { Token, Investment } from '../src/types';

const token: Token = {
  id: '1',
  symbol: 'USDT',
  name: 'Tether USD',
  // ...
};
```

#### src/hooks/
自定义React Hooks。

**useTokenData.ts**
- 代币数据管理Hook
- 处理数据加载和刷新
- 错误处理

#### src/services/
API服务层。

**apiClient.ts**
- 统一的API客户端
- 请求拦截器
- 响应处理

**modules/**
- tokenService.ts - 代币相关API
- investmentService.ts - 投资相关API
- transactionService.ts - 交易相关API

#### src/store/
状态管理（预留）。

---

### components/ 目录（业务组件）

#### components/ui/
shadcn/ui提供的基础UI组件。

**常用组件**:
- button.tsx - 按钮组件
- card.tsx - 卡片容器
- dialog.tsx - 对话框
- table.tsx - 表格组件
- input.tsx - 输入框
- select.tsx - 下拉选择
- badge.tsx - 标签
- tabs.tsx - 标签页

#### 业务组件

**表格组件**:
- InvestmentTable.tsx - 投资表格
- TokenTable.tsx - 代币表格
- TransactionRecords.tsx - 交易记录表格
- CommissionTable.tsx - 佣金表格
- ReferralTable.tsx - 推荐表格

**对话框组件**:
- SwapDialog.tsx - 代币交换对话框
- WithdrawDialog.tsx - 提现对话框
- CreateTokenDialog.tsx - 创建代币对话框
- TokenSelectionDialog.tsx - 代币选择对话框

**页面组件**:
- TokenProfile.tsx - 代币资料页
- TradingPage.tsx - 交易页面
- PublicSale.tsx - 公售页面
- TokenDetailPage.tsx - 代币详情页

**展示组件**:
- PortfolioOverview.tsx - 投资组合概览
- MarketOverview.tsx - 市场概览
- TradingStatistics.tsx - 交易统计
- HeroSection.tsx - 首页英雄区
- QuickActions.tsx - 快速操作

**其他组件**:
- TokenStatsGrid.tsx - 代币统计网格

---

### guidelines/ 目录

#### Guidelines.md
设计规范文档，包含：

1. **颜色系统**
   - 主色: #0fb981
   - 悬停色: #22c55e
   - USDT色: #26a17b

2. **按钮设计原则**
   - 主按钮样式
   - 辅助按钮样式
   - 文字链接样式

3. **Tailwind CSS规范**
   - ✅ 正确用法
   - ❌ 禁止用法
   - 代码审查清单

---

### styles/ 目录

#### globals.css
全局样式文件，包含：

1. **Tailwind配置**
   - @tailwind base, components, utilities
   - 自定义CSS变量

2. **自定义动画**
   - @keyframes 定义
   - animate-* 类名

3. **全局样式**
   - 字体设置
   - 滚动条样式
   - 基础元素样式

---

## 🎯 命名规范

### 文件命名
- **组件文件**: PascalCase (如 TokenIcon.tsx)
- **工具文件**: camelCase (如 format.ts)
- **类型文件**: index.ts (统一导出)
- **样式文件**: kebab-case (如 globals.css)

### 组件命名
```tsx
// 组件名使用PascalCase
export function TokenIcon() {}

// Props接口以Props结尾
interface TokenIconProps {}

// 自定义Hook以use开头
export function useTokenData() {}
```

### 文件导出
```tsx
// 优先使用命名导出
export function formatCurrency() {}
export const COLORS = {};

// 仅在入口组件使用默认导出
export default App;
```

---

## 📦 导入路径规范

### 使用相对路径
```tsx
// 从src/导入
import { TokenIcon } from '../src/components/common/TokenIcon';
import { formatCurrency } from '../src/utils/format';

// 从components/导入
import { Button } from './ui/button';
import { Card } from './ui/card';

// 同级目录
import { SwapDialog } from './SwapDialog';
```

### 导入顺序
1. React及第三方库
2. UI组件
3. 共享组件
4. 工具函数和常量
5. 类型定义
6. 样式文件

**示例**:
```tsx
// 1. React和第三方库
import { useState } from 'react';
import { toast } from 'sonner';

// 2. UI组件
import { Button } from './ui/button';
import { Dialog } from './ui/dialog';

// 3. 共享组件
import { TokenIcon } from '../src/components/common/TokenIcon';

// 4. 工具函数
import { formatCurrency } from '../src/utils/format';
import { COLORS } from '../src/utils/constants';

// 5. 类型
import type { Token } from '../src/types';

// 6. 样式（如果需要）
import './styles.css';
```

---

## 🔄 文件关系图

```
App.tsx
  ├── components/InvestmentTable.tsx
  │     ├── src/components/common/TokenIcon.tsx
  │     ├── src/utils/format.ts
  │     └── src/utils/constants.ts
  │
  ├── components/SwapDialog.tsx
  │     ├── src/components/common/TokenSelector.tsx
  │     │     └── src/components/common/TokenIcon.tsx
  │     ├── src/utils/format.ts
  │     └── src/utils/mockData.ts
  │
  └── components/TokenProfile.tsx
        ├── src/components/common/TokenIcon.tsx
        ├── src/utils/format.ts
        ├── src/utils/clipboard.ts
        └── src/types/index.ts
```

---

## 📊 组件依赖统计

### 共享组件使用频率
- **TokenIcon**: 12个组件使用
- **TokenSelector**: 2个组件使用

### 工具函数使用频率
- **formatCurrency**: 15个组件使用
- **formatPercentage**: 8个组件使用
- **COLORS常量**: 所有组件使用
- **VALUE_TOKENS**: 6个组件使用

---

## 🛠️ 开发工作流

### 添加新组件
1. 在 `components/` 创建组件文件
2. 使用共享组件 (TokenIcon等)
3. 使用工具函数 (format.ts)
4. 导入类型定义 (types/)
5. 遵循设计规范 (Guidelines.md)

### 添加新工具函数
1. 在 `src/utils/` 对应文件中添加
2. 导出函数
3. 在需要的组件中导入使用

### 添加新类型
1. 在 `src/types/index.ts` 添加
2. 导出类型
3. 在组件中使用 `import type`

---

## 📚 相关文档

- [快速开始指南](../../QUICK_START.md)
- [设计规范](../../guidelines/Guidelines.md)
- [共享组件指南](./SHARED_COMPONENTS_SUMMARY.md)
- [重构指南](../guides/REFACTORING_GUIDE.md)

---

**文档最后更新**: 2025年10月12日  
**维护者**: DEX Team

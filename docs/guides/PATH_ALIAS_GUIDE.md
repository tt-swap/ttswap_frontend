# 📂 路径别名导入指南

## 🎯 概述

项目已配置完整的路径别名系统，让您可以使用简洁的 `@` 符号导入代替冗长的相对路径。

---

## 📋 可用别名列表

| 别名 | 映射路径 | 用途 |
|------|----------|------|
| `@/*` | `./src/*` | src目录下的任何文件 |
| `@components/*` | `./src/components/*` | 业务组件 |
| `@pages/*` | `./src/pages/*` | 页面组件 |
| `@hooks/*` | `./src/hooks/*` | 自定义Hooks |
| `@services/*` | `./src/services/*` | API服务 |
| `@utils/*` | `./src/utils/*` | 工具函数 |
| `@store/*` | `./src/store/*` | 状态管理 |
| `@types/*` | `./src/types/*` | TypeScript类型 |
| `@styles/*` | `./src/styles/*` | 样式文件 |
| `@legacy-components/*` | `./components/*` | ShadCN UI组件 |

---

## 🚀 快速示例

### Before (相对路径) ❌

```tsx
import { PortfolioOverview } from '../../../src/components/business/PortfolioOverview';
import { formatCurrency } from '../../../src/utils/format';
import { Button } from '../../../components/ui/button';
import type { Token } from '../../../src/types';
```

### After (路径别名) ✅

```tsx
import { PortfolioOverview } from '@components/business';
import { formatCurrency } from '@utils/format';
import { Button } from '@legacy-components/ui/button';
import type { Token } from '@types';
```

---

## 📚 分类使用指南

### 1️⃣ 业务组件导入

```tsx
// 业务组件
import { PortfolioOverview, TokenProfile } from '@components/business';

// 表格组件
import { InvestmentTable, TokenTable } from '@components/tables';

// 对话框组件
import { SwapDialog, CreateTokenDialog } from '@components/dialogs';

// 布局组件
import { HeroSection, MarketOverview } from '@components/layout';

// 通用组件
import { TokenIcon, TokenSelector } from '@components/common';
```

### 2️⃣ 页面组件导入

```tsx
import { TradingPage, PublicSale, TokenDetailPage } from '@pages';
```

### 3️⃣ UI组件导入（ShadCN）

```tsx
// 方式1: 使用别名（推荐）
import { Button } from '@legacy-components/ui/button';
import { Card, CardHeader, CardContent } from '@legacy-components/ui/card';
import { Dialog } from '@legacy-components/ui/dialog';

// 方式2: 相对路径（也可以）
import { Button } from './components/ui/button';
```

### 4️⃣ 工具函数导入

```tsx
import { formatCurrency, formatPercentage } from '@utils/format';
import { VALUE_TOKENS, COLORS } from '@utils/constants';
import { copyToClipboard } from '@utils/clipboard';
```

### 5️⃣ Hooks导入

```tsx
import { useTokenData } from '@hooks/useTokenData';
```

### 6️⃣ 服务导入

```tsx
import { tokenService } from '@services/modules/tokenService';
import { investmentService } from '@services/modules/investmentService';
import { apiClient } from '@services/apiClient';
```

### 7️⃣ 类型导入

```tsx
import type { Token, Investment, Transaction } from '@types';
```

### 8️⃣ 样式导入

```tsx
import '@styles/global.css';
import '@styles/variables.css';
```

---

## 🎨 完整组件示例

### 示例：创建一个新的页面组件

```tsx
// 文件: src/pages/MyNewPage.tsx

// ===== 第三方库 =====
import { useState } from 'react';

// ===== UI组件 (ShadCN) =====
import { Button } from '@legacy-components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@legacy-components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@legacy-components/ui/tabs';
import { Dialog } from '@legacy-components/ui/dialog';

// ===== 业务组件 =====
import { PortfolioOverview, TokenProfile } from '@components/business';
import { InvestmentTable, TokenTable } from '@components/tables';
import { SwapDialog, WithdrawDialog } from '@components/dialogs';
import { HeroSection, QuickActions } from '@components/layout';
import { TokenIcon, TokenSelector } from '@components/common';

// ===== Hooks =====
import { useTokenData } from '@hooks/useTokenData';

// ===== 工具函数 =====
import { formatCurrency, formatPercentage } from '@utils/format';
import { VALUE_TOKENS, COLORS } from '@utils/constants';
import { copyToClipboard } from '@utils/clipboard';

// ===== 服务 =====
import { tokenService } from '@services/modules/tokenService';
import { investmentService } from '@services/modules/investmentService';

// ===== 类型定义 =====
import type { Token, Investment, Transaction } from '@types';

// ===== 样式 =====
import '@styles/global.css';

export function MyNewPage() {
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const { tokens, loading } = useTokenData();

  return (
    <div className="container mx-auto p-6">
      <HeroSection />
      <PortfolioOverview />
      <TokenTable 
        data={tokens} 
        onTokenClick={setSelectedToken}
      />
      {selectedToken && (
        <TokenProfile token={selectedToken} />
      )}
    </div>
  );
}

export default MyNewPage;
```

---

## 🔄 导入顺序规范

建议按以下顺序组织导入语句：

```tsx
// 1. React和第三方库
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

// 2. UI组件库（ShadCN）
import { Button } from '@legacy-components/ui/button';
import { Card } from '@legacy-components/ui/card';

// 3. 业务组件（按类型分组）
import { PortfolioOverview } from '@components/business';
import { TokenTable } from '@components/tables';
import { SwapDialog } from '@components/dialogs';

// 4. Hooks
import { useTokenData } from '@hooks/useTokenData';

// 5. 工具函数
import { formatCurrency } from '@utils/format';
import { VALUE_TOKENS } from '@utils/constants';

// 6. 服务
import { tokenService } from '@services/modules/tokenService';

// 7. 类型定义（单独一组）
import type { Token, Investment } from '@types';

// 8. 样式文件（最后）
import '@styles/global.css';
```

---

## 🛠️ 配置详情

### TypeScript配置 (tsconfig.json)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@pages/*": ["./src/pages/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"],
      "@utils/*": ["./src/utils/*"],
      "@store/*": ["./src/store/*"],
      "@types/*": ["./src/types/*"],
      "@styles/*": ["./src/styles/*"],
      "@legacy-components/*": ["./components/*"]
    }
  }
}
```

### Vite配置 (vite.config.ts)

```typescript
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@legacy-components': path.resolve(__dirname, './components'),
    },
  },
});
```

---

## 🎯 最佳实践

### ✅ DO（推荐做法）

```tsx
// ✅ 使用路径别名
import { TokenTable } from '@components/tables';

// ✅ 导入整个模块时省略index
import { formatCurrency } from '@utils/format';

// ✅ 明确类型导入
import type { Token } from '@types';

// ✅ 分组导入
import { 
  PortfolioOverview, 
  TokenProfile,
  TradingStatistics 
} from '@components/business';
```

### ❌ DON'T（避免做法）

```tsx
// ❌ 不要使用长的相对路径
import { TokenTable } from '../../../src/components/tables/TokenTable';

// ❌ 不要包含index文件名
import { formatCurrency } from '@utils/format/index';

// ❌ 不要混合导入风格
import { TokenTable } from '@components/tables';
import { formatCurrency } from '../../utils/format'; // 不一致！
```

---

## 🔍 IDE智能提示

### VS Code配置

路径别名已配置完成，VS Code会自动：
- ✅ 提供导入建议
- ✅ 自动完成路径
- ✅ 支持跳转到定义
- ✅ 重构时自动更新导入

### 验证配置

测试智能提示是否工作：

```tsx
// 输入以下内容，应该看到自动完成
import { /* 按Ctrl+Space查看建议 */ } from '@components/
```

---

## 🔄 迁移现有代码

### 方法1：全局搜索替换（推荐）

使用VS Code的查找替换功能：

1. **替换业务组件导入**
   ```
   查找: from ['"](\.\./)+src/components/business
   替换: from '@components/business
   ```

2. **替换工具函数导入**
   ```
   查找: from ['"](\.\./)+src/utils
   替换: from '@utils
   ```

3. **替换类型导入**
   ```
   查找: from ['"](\.\./)+src/types
   替换: from '@types
   ```

### 方法2：手动迁移

逐个文件检查并更新：

```bash
# 查找所有使用相对路径的文件
grep -r "from '\.\./\.\./src" src/
```

---

## 📊 迁移清单

使用此清单追踪迁移进度：

- [ ] 业务组件 (`@components/business`)
- [ ] 表格组件 (`@components/tables`)
- [ ] 对话框组件 (`@components/dialogs`)
- [ ] 布局组件 (`@components/layout`)
- [ ] 通用组件 (`@components/common`)
- [ ] 页面组件 (`@pages`)
- [ ] Hooks (`@hooks`)
- [ ] 工具函数 (`@utils`)
- [ ] 服务 (`@services`)
- [ ] 类型定义 (`@types`)
- [ ] 样式文件 (`@styles`)

---

## ❓ 常见问题

### Q1: 路径别名不工作？
**A**: 重启开发服务器 (`npm run dev`)

### Q2: TypeScript报错找不到模块？
**A**: 检查 `tsconfig.json` 中的 `paths` 配置是否正确

### Q3: 应该使用 `@components` 还是 `@/components`？
**A**: 两者都可以，但推荐使用 `@components`（更简洁）

### Q4: ShadCN组件应该用哪个别名？
**A**: 使用 `@legacy-components/ui/xxx` 或相对路径 `./components/ui/xxx`

### Q5: 可以自定义别名吗？
**A**: 可以！在 `tsconfig.json` 和 `vite.config.ts` 中添加新的映射

---

## 🎓 学习资源

- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
- [Vite Alias Configuration](https://vitejs.dev/config/shared-options.html#resolve-alias)
- [项目设计规范](../../guidelines/Guidelines.md)

---

## 🚀 下一步

1. ✅ 在新组件中使用路径别名
2. ✅ 逐步迁移现有代码
3. ✅ 享受更简洁的导入语句！

---

**文档版本**: v1.0  
**最后更新**: 2025-10-12  
**维护者**: 项目团队

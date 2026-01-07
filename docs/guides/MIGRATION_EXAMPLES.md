# 🔄 路径别名迁移示例

本文档展示如何将现有的相对路径导入迁移到路径别名。

---

## 📝 示例1: TokenTable.tsx

### 迁移前 ❌

```tsx
// 文件: src/components/tables/TokenTable.tsx

import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

import { formatCurrency, formatPercentage } from "../../utils/format";
import { VALUE_TOKENS } from "../../utils/constants";
import type { Token } from "../../types";
```

### 迁移后 ✅

```tsx
// 文件: src/components/tables/TokenTable.tsx

import { Button } from "@legacy-components/ui/button";
import { Card } from "@legacy-components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@legacy-components/ui/table";

import { formatCurrency, formatPercentage } from "@utils/format";
import { VALUE_TOKENS } from "@utils/constants";
import type { Token } from "@types";
```

---

## 📝 示例2: TradingPage.tsx

### 迁移前 ❌

```tsx
// 文件: src/pages/TradingPage.tsx

import { InvestmentTable } from "../components/tables/InvestmentTable";
import { TokenTable } from "../components/tables/TokenTable";
import { PortfolioOverview } from "../components/business/PortfolioOverview";
import { 
  CreateTokenDialog, 
  SwapDialog, 
  WithdrawDialog 
} from "../components/dialogs";
import { TokenProfile } from "../components/business";
import { TransactionRecords } from "../components/tables/TransactionRecords";
import { TradingStatistics } from "../components/business/TradingStatistics";
```

### 迁移后 ✅

```tsx
// 文件: src/pages/TradingPage.tsx

import { InvestmentTable, TokenTable, TransactionRecords } from "@components/tables";
import { PortfolioOverview, TokenProfile, TradingStatistics } from "@components/business";
import { CreateTokenDialog, SwapDialog, WithdrawDialog } from "@components/dialogs";
```

**优势**: 更简洁，分组清晰！

---

## 📝 示例3: PortfolioOverview.tsx

### 迁移前 ❌

```tsx
// 文件: src/components/business/PortfolioOverview.tsx

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { formatCurrency } from "../../utils/format";
import { COLORS } from "../../utils/constants";
import type { PortfolioData } from "../../types";
```

### 迁移后 ✅

```tsx
// 文件: src/components/business/PortfolioOverview.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@legacy-components/ui/card";
import { formatCurrency } from "@utils/format";
import { COLORS } from "@utils/constants";
import type { PortfolioData } from "@types";
```

---

## 📝 示例4: SwapDialog.tsx

### 迁移前 ❌

```tsx
// 文件: src/components/dialogs/SwapDialog.tsx

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { TokenSelector } from "../common/TokenSelector";
import { formatCurrency } from "../../utils/format";
import { tokenService } from "../../services/modules/tokenService";
import type { Token } from "../../types";
```

### 迁移后 ✅

```tsx
// 文件: src/components/dialogs/SwapDialog.tsx

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@legacy-components/ui/dialog";
import { Button } from "@legacy-components/ui/button";
import { Input } from "@legacy-components/ui/input";
import { TokenSelector } from "@components/common";
import { formatCurrency } from "@utils/format";
import { tokenService } from "@services/modules/tokenService";
import type { Token } from "@types";
```

---

## 📝 示例5: App.tsx (根组件)

### 迁移前 ❌

```tsx
// 文件: App.tsx

import { InvestmentTable } from "./src/components/tables/InvestmentTable";
import { TokenTable } from "./src/components/tables/TokenTable";
import { PortfolioOverview } from "./src/components/business/PortfolioOverview";
import { CreateTokenDialog, SwapDialog, WithdrawDialog } from "./src/components/dialogs";
import { TokenProfile } from "./src/components/business";
import { PublicSale, TokenDetailPage, TradingPage } from "./src/pages";
import { HeroSection } from "./src/components/layout/HeroSection";
```

### 迁移后 ✅

```tsx
// 文件: App.tsx

import { InvestmentTable, TokenTable } from "@components/tables";
import { PortfolioOverview, TokenProfile } from "@components/business";
import { CreateTokenDialog, SwapDialog, WithdrawDialog } from "@components/dialogs";
import { PublicSale, TokenDetailPage, TradingPage } from "@pages";
import { HeroSection } from "@components/layout";
```

---

## 🔍 VS Code 搜索替换模式

### 替换表格组件导入

**查找**:
```regex
from ["']\.\.\/\.\.\/src\/components\/tables
```

**替换**:
```
from "@components/tables
```

---

### 替换业务组件导入

**查找**:
```regex
from ["']\.\.\/\.\.\/src\/components\/business
```

**替换**:
```
from "@components/business
```

---

### 替换工具函数导入

**查找**:
```regex
from ["']\.\.\/\.\.\/utils\/
```

**替换**:
```
from "@utils/
```

---

### 替换UI组件导入

**查找**:
```regex
from ["']\.\.\/\.\.\/\.\.\/components\/ui\/
```

**替换**:
```
from "@legacy-components/ui/
```

---

## 📊 迁移对比表

| 导入类型 | 旧路径示例 | 新路径示例 | 节省字符 |
|---------|-----------|-----------|---------|
| 业务组件 | `../../src/components/business` | `@components/business` | ~14字符 |
| 表格组件 | `../../src/components/tables` | `@components/tables` | ~12字符 |
| UI组件 | `../../../components/ui/button` | `@legacy-components/ui/button` | ~10字符 |
| 工具函数 | `../../utils/format` | `@utils/format` | ~11字符 |
| 类型定义 | `../../types` | `@types` | ~11字符 |

**总体效率**: 每个导入平均节省 **10-15个字符**，提高可读性！

---

## 🎯 分步迁移计划

### 第1步: 迁移工具函数和类型 (最简单)
```bash
# 查找所有使用utils的文件
grep -r "from.*utils" src/

# 查找所有使用types的文件  
grep -r "from.*types" src/
```

### 第2步: 迁移业务组件
```bash
# 查找所有业务组件导入
grep -r "from.*components/business" src/
```

### 第3步: 迁移表格和对话框组件
```bash
# 查找表格组件
grep -r "from.*components/tables" src/

# 查找对话框组件
grep -r "from.*components/dialogs" src/
```

### 第4步: 迁移UI组件 (可选)
```bash
# 查找UI组件导入
grep -r 'from.*components/ui' src/
```

---

## ✅ 迁移后验证

### 1. TypeScript检查
```bash
npx tsc --noEmit
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 检查控制台
确保没有模块找不到的错误。

### 4. 测试功能
浏览所有页面确保功能正常。

---

## 💡 专业提示

### 提示1: 渐进式迁移
不需要一次性迁移所有文件，可以在修改文件时逐步迁移。

### 提示2: 使用IDE自动导入
配置完成后，IDE会自动使用路径别名进行导入建议。

### 提示3: 团队规范
在团队中统一使用路径别名，保持代码风格一致。

### 提示4: 重启服务器
修改配置文件后记得重启开发服务器。

---

## 🔗 相关文档

- [路径别名完整指南](./PATH_ALIAS_GUIDE.md)
- [设计规范](../../guidelines/Guidelines.md)
- [项目结构说明](../architecture/PROJECT_STRUCTURE.md)

---

**开始迁移，享受更简洁的代码！** 🚀

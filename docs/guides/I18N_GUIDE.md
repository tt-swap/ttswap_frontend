# 🌍 国际化 (i18n) 使用指南

## 📋 概述

本项目已完整配置国际化系统，支持**中文**和**英文**双语切换。

---

## ✨ 特性

- ✅ **自动语言检测** - 根据浏览器语言自动选择
- ✅ **持久化存储** - 用户选择的语言保存在 localStorage
- ✅ **类型安全** - 完整的 TypeScript 类型支持
- ✅ **简单易用** - 使用 Hook 访问翻译
- ✅ **语言切换器** - 内置语言切换组件

---

## 🚀 快速开始

### 1. 在组件中使用翻译

```tsx
import { useTranslation } from '../../i18n';

function MyComponent() {
  const t = useTranslation();
  
  return (
    <div>
      <h1>{t.common.confirm}</h1>
      <p>{t.token.price}</p>
      <button>{t.common.submit}</button>
    </div>
  );
}
```

### 2. 添加语言切换器

```tsx
import { LanguageSwitcher } from '@components/common';

function Header() {
  return (
    <div className="flex items-center gap-4">
      <h1>My App</h1>
      <LanguageSwitcher />
    </div>
  );
}
```

### 3. 获取当前语言

```tsx
import { useLanguage } from '../../i18n';

function MyComponent() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div>
      <p>Current language: {language}</p>
      <button onClick={() => setLanguage('en')}>English</button>
      <button onClick={() => setLanguage('zh')}>中文</button>
    </div>
  );
}
```

---

## 📂 文件结构

```
src/i18n/
├── index.ts              # 导出所有国际化相关功能
├── types.ts              # TypeScript 类型定义
├── context.tsx           # React Context 和 Hooks
└── locales/
    ├── zh.ts            # 中文翻译
    └── en.ts            # 英文翻译
```

---

## 🔤 翻译键结构

### 可用的翻译分类

| 分类 | 键名 | 说明 |
|------|------|------|
| 通用 | `common` | 确认、取消、保存等 |
| 导航 | `nav` | 导航菜单项 |
| 投资组合 | `portfolio` | 投资组合相关 |
| 代币 | `token` | 代币相关 |
| 投资 | `investment` | 投资相关 |
| 交易 | `transaction` | 交易相关 |
| 统计 | `statistics` | 统计数据 |
| 佣金 | `commission` | 佣金相关 |
| 推荐人 | `referral` | 推荐相关 |
| 对话框 | `dialog` | 各种对话框 |
| 验证 | `validation` | 表单验证 |
| 消息 | `messages` | 成功/错误提示 |
| 英雄区 | `hero` | 首页英雄区块 |
| 市场 | `market` | 市场概览 |

---

## 💡 使用示例

### 示例1: 按钮和通用文本

```tsx
import { useTranslation } from '../../i18n';

function ActionButtons() {
  const t = useTranslation();
  
  return (
    <div className="flex gap-2">
      <button>{t.common.confirm}</button>
      <button>{t.common.cancel}</button>
      <button>{t.common.save}</button>
    </div>
  );
}
```

**输出**:
- 中文: 确认 | 取消 | 保存
- English: Confirm | Cancel | Save

### 示例2: 表格标题

```tsx
import { useTranslation } from '../../i18n';

function TokenTable() {
  const t = useTranslation();
  
  return (
    <table>
      <thead>
        <tr>
          <th>{t.investment.id}</th>
          <th>{t.token.name}</th>
          <th>{t.token.price}</th>
          <th>{t.token.value}</th>
          <th>{t.common.actions}</th>
        </tr>
      </thead>
    </table>
  );
}
```

**输出**:
- 中文: 序号 | 名称 | 价格 | 价值 | 操作
- English: ID | Name | Price | Value | Actions

### 示例3: 表单验证消息

```tsx
import { useTranslation } from '../../i18n';

function LoginForm() {
  const t = useTranslation();
  const [error, setError] = useState('');
  
  const validate = (email: string) => {
    if (!email) {
      setError(t.validation.required);
    } else if (!isValidEmail(email)) {
      setError(t.validation.invalidEmail);
    }
  };
  
  return (
    <div>
      <input type="email" />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
}
```

### 示例4: Toast 通知

```tsx
import { useTranslation } from '../../i18n';
import { toast } from 'sonner';

function SwapButton() {
  const t = useTranslation();
  
  const handleSwap = async () => {
    try {
      await performSwap();
      toast.success(t.messages.success.swapCompleted);
    } catch (error) {
      toast.error(t.messages.error.swapFailed);
    }
  };
  
  return <button onClick={handleSwap}>{t.token.swap}</button>;
}
```

---

## 🎨 LanguageSwitcher 组件

### 基本用法

```tsx
import { LanguageSwitcher } from '@components/common';

// 默认样式
<LanguageSwitcher />

// 自定义样式
<LanguageSwitcher 
  variant="outline" 
  size="sm" 
  showText={false} 
/>
```

### Props

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `variant` | `'default' \| 'outline' \| 'ghost'` | `'ghost'` | 按钮样式 |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | 按钮大小 |
| `showText` | `boolean` | `true` | 是否显示语言文本 |

### 样式示例

```tsx
// Ghost 样式（默认）
<LanguageSwitcher variant="ghost" />

// Outline 样式
<LanguageSwitcher variant="outline" />

// 小尺寸，仅图标
<LanguageSwitcher size="sm" showText={false} />

// 集成到导航栏
<nav className="flex items-center justify-between">
  <Logo />
  <div className="flex items-center gap-4">
    <NavLinks />
    <LanguageSwitcher />
  </div>
</nav>
```

---

## 📝 添加新翻译

### 步骤1: 更新类型定义

编辑 `src/i18n/types.ts`:

```typescript
export interface TranslationKeys {
  // ... 现有的键
  
  // 新增分类
  myNewSection: {
    title: string;
    description: string;
    action: string;
  };
}
```

### 步骤2: 添加中文翻译

编辑 `src/i18n/locales/zh.ts`:

```typescript
export const zh: TranslationKeys = {
  // ... 现有的翻译
  
  myNewSection: {
    title: '我的新章节',
    description: '这是描述',
    action: '执行操作',
  },
};
```

### 步骤3: 添加英文翻译

编辑 `src/i18n/locales/en.ts`:

```typescript
export const en: TranslationKeys = {
  // ... 现有的翻译
  
  myNewSection: {
    title: 'My New Section',
    description: 'This is a description',
    action: 'Perform Action',
  },
};
```

### 步骤4: 在组件中使用

```tsx
function MyNewComponent() {
  const t = useTranslation();
  
  return (
    <div>
      <h2>{t.myNewSection.title}</h2>
      <p>{t.myNewSection.description}</p>
      <button>{t.myNewSection.action}</button>
    </div>
  );
}
```

---

## 🔄 导入路径

### 推荐方式（相对路径）

```tsx
// 从组件中导入
import { useTranslation, useLanguage } from '../../i18n';
```

### 路径参考

根据组件位置使用正确的相对路径：

| 组件位置 | 导入路径 |
|---------|---------|
| `src/components/tables/` | `../../i18n` |
| `src/components/business/` | `../../i18n` |
| `src/components/dialogs/` | `../../i18n` |
| `src/components/layout/` | `../../i18n` |
| `src/pages/` | `../i18n` |
| `App.tsx` | `./src/i18n` |

---

## 🎯 完整组件示例

```tsx
// 文件: src/components/MyComponent.tsx

import { useState } from 'react';
import { Button } from '@legacy-components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@legacy-components/ui/card';
import { useTranslation, useLanguage } from '../../i18n';
import { LanguageSwitcher } from '@components/common';
import { toast } from 'sonner';

export function MyComponent() {
  const t = useTranslation();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitData();
      toast.success(t.messages.success.tokenCreated);
    } catch (error) {
      toast.error(t.messages.error.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* 标题和语言切换 */}
      <div className="flex items-center justify-between mb-6">
        <h1>{t.portfolio.title}</h1>
        <LanguageSwitcher />
      </div>

      {/* 内容卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>{t.portfolio.overview}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {t.portfolio.totalValue}
              </p>
              <p className="text-2xl font-bold">$1,234.56</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                {t.portfolio.totalProfit}
              </p>
              <p className="text-2xl font-bold text-[#0fb981]">+$123.45</p>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button 
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#0fb981] hover:bg-[#22c55e]"
            >
              {loading ? t.common.loading : t.common.submit}
            </Button>
            <Button variant="outline">
              {t.common.cancel}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 当前语言提示 */}
      <p className="mt-4 text-sm text-muted-foreground">
        {language === 'zh' ? '当前语言：中文' : 'Current Language: English'}
      </p>
    </div>
  );
}
```

---

## 🛠️ 高级用法

### 条件渲染

```tsx
const t = useTranslation();
const { language } = useLanguage();

// 根据语言显示不同内容
{language === 'zh' ? (
  <ChineseSpecificComponent />
) : (
  <EnglishSpecificComponent />
)}

// 使用翻译文本
<p>{t.hero.subtitle}</p>
```

### 动态插值

如果需要在翻译中插入动态值，使用模板字符串：

```tsx
const t = useTranslation();
const userName = 'John';

// 不推荐：在翻译文件中硬编码
// 推荐：在组件中拼接
<p>{`${t.common.welcome}, ${userName}!`}</p>
```

---

## 📊 可用翻译键列表

### Common (通用)
```tsx
t.common.confirm        // 确认 / Confirm
t.common.cancel         // 取消 / Cancel
t.common.save          // 保存 / Save
t.common.delete        // 删除 / Delete
t.common.edit          // 编辑 / Edit
t.common.search        // 搜索 / Search
t.common.loading       // 加载中... / Loading...
t.common.noData        // 暂无数据 / No Data
t.common.actions       // 操作 / Actions
t.common.copy          // 复制 / Copy
t.common.copied        // 已复制 / Copied
```

### Token (代币)
```tsx
t.token.name           // 名称 / Name
t.token.symbol         // 代币 / Symbol
t.token.price          // 价格 / Price
t.token.change24h      // 24小时涨跌幅 / 24h Change
t.token.netValue       // 每份净值 / Net Value
t.token.yearlyReturn   // 年收益率 / Yearly Return
t.token.value          // 价值 / Value
t.token.swap           // 交换 / Swap
t.token.invest         // 投资 / Invest
t.token.withdraw       // 提现 / Withdraw
t.token.noTokens       // 暂无代币数据 / No tokens available
```

### Investment (投资)
```tsx
t.investment.title     // 投资 / Investment
t.investment.proof     // 投资证明 / Investment Proof
t.investment.id        // 序号 / ID
t.investment.asset     // 资产 / Asset
t.investment.profit    // 收益 / Profit
```

### Dialog (对话框)
```tsx
t.dialog.swap.title              // 兑换 / Swap
t.dialog.swap.from               // 支付 / From
t.dialog.swap.to                 // 接收 / To
t.dialog.swap.amount             // 数量 / Amount
t.dialog.swap.confirm            // 确认兑换 / Confirm Swap

t.dialog.withdraw.title          // 提现 / Withdraw
t.dialog.createToken.title       // 创建代币 / Create Token
```

### Messages (消息)
```tsx
t.messages.success.swapCompleted     // 兑换成功 / Swap completed successfully
t.messages.success.tokenCreated      // 代币创建成功 / Token created successfully
t.messages.success.copied            // 已复制到剪贴板 / Copied to clipboard

t.messages.error.swapFailed          // 兑换失败 / Swap failed
t.messages.error.networkError        // 网络错误 / Network error
```

[查看完整列表](../../src/i18n/types.ts)

---

## ⚠️ 注意事项

### 1. 导入路径
使用**相对路径**而不是路径别名：
```tsx
// ✅ 正确
import { useTranslation } from '../../i18n';

// ❌ 错误（会导致构建错误）
import { useTranslation } from '@/i18n';
```

### 2. Provider 必须在顶层
确保 `I18nProvider` 包裹整个应用：
```tsx
// main.tsx
import { I18nProvider } from './i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <I18nProvider>
    <App />
  </I18nProvider>
);
```

### 3. 类型安全
TypeScript 会自动提示可用的翻译键：
```tsx
const t = useTranslation();

// IDE 会提示 common 下的所有键
t.common.  // ← 自动完成
```

### 4. 性能优化
`useTranslation` Hook 性能已优化，可以在任何组件中安全使用。

---

## 🔍 故障排除

### 问题1: 导入错误
**错误**: `Failed to fetch https://esm.sh/@/i18n`

**解决**: 使用相对路径而不是 `@/` 别名
```tsx
import { useTranslation } from '../../i18n';
```

### 问题2: 翻译未生效
**检查**:
1. ✅ `I18nProvider` 是否包裹了应用？
2. ✅ 翻译键是否正确？
3. ✅ 是否正确导入了 `useTranslation`？

### 问题3: TypeScript 类型错误
**解决**: 确保新增的翻译已添加到 `types.ts` 中

---

## 📚 相关资源

- [项目 README](../../README.md)
- [组件文档](../architecture/SHARED_COMPONENTS_SUMMARY.md)
- [设计规范](../../guidelines/Guidelines.md)

---

**国际化系统已完全配置，开始使用吧！** 🌍✨

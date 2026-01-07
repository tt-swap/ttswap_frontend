# 代码重构指南

本文档提供系统化的代码重构方法论和最佳实践，帮助开发者高效、安全地重构代码。

---

## 📚 目录

1. [重构原则](#重构原则)
2. [重构流程](#重构流程)
3. [常见重构模式](#常见重构模式)
4. [工具和技巧](#工具和技巧)
5. [质量保证](#质量保证)

---

## 重构原则

### 1. 小步前进
- ✅ 每次只重构一个小功能
- ✅ 每次改动后立即测试
- ✅ 确保每次提交都是可工作的状态

### 2. 保持功能不变
- ✅ 重构不改变外部行为
- ✅ 保持所有Props接口兼容
- ✅ 保持视觉效果一致

### 3. 测试驱动
- ✅ 重构前确保有测试覆盖
- ✅ 重构后运行所有测试
- ✅ 手动验证关键功能

### 4. 文档同步
- ✅ 重构后更新相关文档
- ✅ 记录重构决策和原因
- ✅ 更新代码注释

---

## 重构流程

### 阶段1: 评估和规划

#### 1.1 识别重构目标
```
- 代码重复？
- 组件过大？
- 逻辑混乱？
- 性能问题？
```

#### 1.2 分析影响范围
```bash
# 搜索组件使用情况
grep -r "ComponentName" components/
grep -r "functionName" src/
```

#### 1.3 制定重构计划
- 列出需要重构的文件
- 估算工作量
- 确定优先级
- 规划测试策略

### 阶段2: 准备工作

#### 2.1 创建备份
```bash
git checkout -b refactor/component-name
```

#### 2.2 理解现有代码
- 阅读代码逻辑
- 理解数据流
- 识别依赖关系
- 记录特殊情况

#### 2.3 准备测试用例
- 列出所有使用场景
- 准备测试数据
- 记录预期行为

### 阶段3: 执行重构

#### 3.1 提取共享组件
```tsx
// 识别重复代码
// 旧代码在多个组件中重复

// 步骤1: 创建共享组件
// src/components/common/SharedComponent.tsx
export function SharedComponent(props) {
  // 提取的逻辑
}

// 步骤2: 在原组件中使用
import { SharedComponent } from '../src/components/common/SharedComponent';

<SharedComponent {...props} />
```

#### 3.2 提取工具函数
```tsx
// 识别重复逻辑
// 旧代码在多处重复计算

// 步骤1: 创建工具函数
// src/utils/helpers.ts
export function calculateValue(input) {
  // 提取的计算逻辑
  return result;
}

// 步骤2: 在组件中使用
import { calculateValue } from '../src/utils/helpers';

const value = calculateValue(input);
```

#### 3.3 简化组件逻辑
```tsx
// 重构前：复杂的内联逻辑
const filteredData = data
  .filter(item => item.status === 'active')
  .map(item => ({
    ...item,
    value: item.price * item.quantity
  }))
  .sort((a, b) => b.value - a.value);

// 重构后：提取为函数
const getActiveItemsByValue = (data) => {
  return data
    .filter(item => item.status === 'active')
    .map(item => ({
      ...item,
      value: item.price * item.quantity
    }))
    .sort((a, b) => b.value - a.value);
};

const filteredData = getActiveItemsByValue(data);
```

### 阶段4: 测试验证

#### 4.1 功能测试
- [ ] 所有功能正常工作
- [ ] Props传递正确
- [ ] 事件处理正常
- [ ] 状态更新正确

#### 4.2 视觉测试
- [ ] 布局保持一致
- [ ] 样式没有变化
- [ ] 动画效果正常
- [ ] 响应式正常

#### 4.3 性能测试
- [ ] 渲染性能
- [ ] 内存使用
- [ ] 包大小影响

### 阶段5: 清理和文档

#### 5.1 代码清理
- 删除未使用的导入
- 删除注释的代码
- 统一代码格式
- 添加必要注释

#### 5.2 更新文档
- 更新组件文档
- 更新API文档
- 记录重构日志
- 更新示例代码

---

## 常见重构模式

### 模式1: 提取组件

**场景**: 相同的UI模式在多处重复

**识别特征**:
```tsx
// 多个组件中出现相似的代码块
<div className="flex items-center gap-2">
  <div className="w-8 h-8 rounded-full..." style={{backgroundColor: color}}>
    {icon}
  </div>
  <span>{name}</span>
</div>
```

**重构方法**:
```tsx
// 1. 创建共享组件
export function ComponentName({ icon, color, name }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full..." style={{backgroundColor: color}}>
        {icon}
      </div>
      <span>{name}</span>
    </div>
  );
}

// 2. 替换使用
<ComponentName icon={icon} color={color} name={name} />
```

**收益**:
- 减少代码重复
- 统一UI表现
- 易于维护

### 模式2: 提取工具函数

**场景**: 相同的数据处理逻辑在多处重复

**识别特征**:
```tsx
// 多个组件中重复的格式化逻辑
const formatted = new Intl.NumberFormat('zh-CN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(value);
```

**重构方法**:
```tsx
// 1. 创建工具函数
// src/utils/format.ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

// 2. 使用工具函数
import { formatCurrency } from '../src/utils/format';
const formatted = formatCurrency(value);
```

**收益**:
- 统一处理逻辑
- 减少错误
- 易于修改

### 模式3: 统一常量

**场景**: 魔法数字或字符串分散在代码中

**识别特征**:
```tsx
// 颜色值硬编码在多处
className="bg-[#0fb981]"
className="text-[#0fb981]"
style={{ color: '#0fb981' }}
```

**重构方法**:
```tsx
// 1. 定义常量
// src/utils/constants.ts
export const COLORS = {
  PRIMARY: '#0fb981',
  PRIMARY_HOVER: '#22c55e',
  USDT: '#26a17b'
};

// 2. 使用常量
// 注意：Tailwind className中仍需硬编码
className="bg-[#0fb981]" // 保持不变（Tailwind要求）
style={{ color: COLORS.PRIMARY }} // 可以使用常量
```

**收益**:
- 集中管理配置
- 易于修改主题
- 提高可读性

### 模式4: 简化条件逻辑

**场景**: 复杂的嵌套条件判断

**识别特征**:
```tsx
// 复杂的条件判断
if (type === "buy" || type === "sell") {
  if (amount > 0) {
    if (balance >= amount) {
      // 执行操作
    }
  }
}
```

**重构方法**:
```tsx
// 1. 提前返回
if (type !== "buy" && type !== "sell") return;
if (amount <= 0) return;
if (balance < amount) return;

// 执行操作

// 2. 提取为验证函数
function isValidTransaction(type, amount, balance) {
  const isValidType = type === "buy" || type === "sell";
  const hasAmount = amount > 0;
  const hasSufficientBalance = balance >= amount;
  return isValidType && hasAmount && hasSufficientBalance;
}

if (isValidTransaction(type, amount, balance)) {
  // 执行操作
}
```

**收益**:
- 提高可读性
- 减少嵌套层级
- 易于测试

---

## 工具和技巧

### 搜索和替换

#### 使用file_search查找重复代码
```
搜索模式: formatCurrency|formatPercentage
名称模式: *.tsx
```

#### 使用grep查找特定模式
```bash
# 查找所有使用TokenIcon的地方
grep -r "TokenIcon" components/

# 查找硬编码的颜色值
grep -r "#0fb981" components/
```

### TypeScript类型

#### 定义共享类型
```tsx
// src/types/index.ts
export interface Token {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  color: string;
  balance: string;
}

// 在组件中使用
import type { Token } from '../src/types';

interface ComponentProps {
  token: Token;
}
```

### 代码分析

#### 识别大文件
```bash
# 查找超过500行的组件
find components/ -name "*.tsx" -exec wc -l {} + | sort -rn
```

#### 识别复杂组件
```
- 超过300行代码
- 超过10个useState
- 超过20个函数
- 嵌套层级超过5层
```

---

## 质量保证

### 代码审查清单

#### 功能性
- [ ] 所有功能正常工作
- [ ] 没有引入新bug
- [ ] 边界情况处理正确
- [ ] 错误处理完善

#### 代码质量
- [ ] 符合命名规范
- [ ] 适当的注释
- [ ] 没有警告信息
- [ ] TypeScript类型完整

#### 性能
- [ ] 没有不必要的重渲染
- [ ] 大列表使用虚拟化
- [ ] 图片适当优化
- [ ] 代码分割合理

#### 可维护性
- [ ] 代码逻辑清晰
- [ ] 适当的抽象层次
- [ ] 遵循DRY原则
- [ ] 文档更新

### 测试策略

#### 单元测试
```tsx
// 测试工具函数
describe('formatCurrency', () => {
  it('formats number correctly', () => {
    expect(formatCurrency(1234.56)).toBe('1,234.56');
  });
});
```

#### 组件测试
```tsx
// 测试共享组件
describe('TokenIcon', () => {
  it('renders correctly', () => {
    render(<TokenIcon symbol="USDT" icon="₮" color="#26a17b" />);
    // 断言
  });
});
```

#### 集成测试
- 测试完整用户流程
- 测试组件交互
- 测试数据流

---

## 常见陷阱

### 陷阱1: 过度重构
❌ **不要**: 重构一切
✅ **要**: 重构有明确收益的部分

### 陷阱2: 忽略测试
❌ **不要**: 重构后不测试
✅ **要**: 每次重构后充分测试

### 陷阱3: 改变行为
❌ **不要**: 在重构中修改功能
✅ **要**: 保持外部行为完全一致

### 陷阱4: 大改动
❌ **不要**: 一次重构太多文件
✅ **要**: 分小步骤逐步重构

---

## 成功案例

### 案例1: TokenIcon组件提取
- **重构前**: 180行重复代码
- **重构后**: 1个共享组件
- **减少**: 约85%代码量

### 案例2: 格式化函数统一
- **重构前**: 15个组件各自实现
- **重构后**: 3个工具函数
- **减少**: 约120行代码

### 案例3: Tailwind动态颜色修复
- **重构前**: 32处编译失败
- **重构后**: 100%编译成功
- **提升**: 构建稳定性

---

## 参考资源

### 推荐阅读
- Martin Fowler - Refactoring
- Clean Code - Robert C. Martin
- React官方文档 - 最佳实践

### 相关文档
- [重构示例](./REFACTORING_EXAMPLES.md)
- [共享组件指南](../architecture/SHARED_COMPONENTS_SUMMARY.md)
- [项目结构说明](../architecture/PROJECT_STRUCTURE.md)

---

**文档最后更新**: 2025年10月12日  
**版本**: 1.0.0  
**维护者**: DEX Team

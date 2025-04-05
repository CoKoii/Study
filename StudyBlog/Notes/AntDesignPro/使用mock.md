# Mock 数据使用指南

## 前言

Mock 数据在前端开发中扮演着重要角色，它能帮助我们在后端接口未完成时进行前端开发和测试。本文将详细介绍在 Ant Design Pro 中如何使用 Mock 功能。

## 运行模式说明

Ant Design Pro 提供两种开发模式，请根据实际需求选择：

### 1. 模拟数据模式 (`pnpm start`)

✨ 特点：

- 默认启用 mock 功能
- 无需后端接口即可开发
- 适合前期开发和调试

### 2. 接口对接模式 (`pnpm dev`)

🔗 特点：

- 自动关闭 mock 功能
- 直接连接真实后端
- 适合联调和测试阶段

## 运行配置详解

项目中的运行配置（位于 package.json）说明：

```json
{
  "scripts": {
    "start": "cross-env UMI_ENV=dev max dev",
    "start:dev": "cross-env REACT_APP_ENV=dev MOCK=none UMI_ENV=dev max dev",
    "dev": "npm run start:dev"
  }
}
```

关键点说明：

- `pnpm dev` 实际执行的是 `start:dev` 命令
- `MOCK=none` 参数用于关闭 mock 功能
- `pnpm start` 没有 mock 相关参数，因此默认开启

## Mock 使用实战

### 步骤 1：准备工作

首先确保使用 `pnpm start` 启动项目，这样 mock 功能才会生效。

### 步骤 2：创建 Mock 文件

在 `mock` 目录下创建数据模拟文件 `Demo.ts`：

```ts
import { Request, Response } from "express";

const box1 = {
  pjcnt: 2,
  ckcnt: 1,
  cicnt: 4,
  dgcnt: 3,
  cmpcnt: 0,
  cocnt: 2,
  impcnt: 0,
};
export default {
  "GET /api/box1": (req: Request, res: Response) => {
    res.json({
      success: true,
      data: box1,
    });
  },
};
```

**代码解析：**

1. `Request, Response` 是 Express 的类型定义，用于类型提示
2. `box1` 对象模拟后端返回的数据结构
3. `GET /api/box1` 定义了接口的请求方法和路径
4. `res.json()` 返回模拟数据，格式为 `{ success: boolean, data: any }`

### 步骤 3：定义接口服务

在 services 目录下统一管理接口定义：

```js
import { request } from "@umijs/max";

export async function getBox1() {
  return request("/api/box1");
}
```

**代码解析：**

1. `request` 是 Umi 提供的请求工具，封装了 fetch API
2. `getBox1` 函数返回 Promise，自动处理请求响应
3. 路径 `/api/box1` 需要与 mock 文件中定义的路径完全匹配

### 步骤 4：组件中调用

在需要使用数据的组件中调用定义好的接口：

```tsx
import { getBox1 } from "@/services/api";

// 初始化数据
const [data, setData] = useState<any>({});

// 请求接口，获取数据
useEffect(() => {
  getBox1().then((res) =>
    res.success ? setData(res.data) : console.log("请求失败")
  );
}, []);
```

**代码解析：**

1. `useState<any>({})` 初始化一个空对象存储数据
2. `useEffect` 在组件挂载时自动执行请求
3. `then` 中处理响应数据：
   - 成功时（`success: true`）更新状态
   - 失败时打印错误信息
4. 空数组依赖表示仅在组件挂载时执行一次

## 使用技巧

🎯 最佳实践：

- 将 mock 数据结构与实际接口保持一致
- 模拟各种场景的返回值
- 合理使用请求延时模拟真实网络环境

⚠️ 注意事项：

- 切换模式时需重启项目
- mock 文件修改后会自动生效
- 建议使用 TypeScript 编写 mock 文件

## 进阶用法

### 模拟延迟响应

```ts
"GET /api/box1": (req: Request, res: Response) => {
  setTimeout(() => {
    res.json({
      success: true,
      data: box1,
    });
  }, 1000); // 延迟1秒返回
}
```

### 模拟错误情况

```ts
"GET /api/box1": (req: Request, res: Response) => {
  res.status(500).json({
    success: false,
    message: '服务器错误'
  });
}
```

# ui-widgets

本项目是一个基于 **React + TypeScript + Vite** 的前端组件库，主要包含两种区块链钱包登录组件：

- **MetaMaskLogin**：支持以太坊钱包登录  
- **TronLinkLogin**：支持波场 TronLink 钱包登录  

---

## 📦 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

---

## 🚀 启动开发环境

```bash
# 使用 npm
npm run dev

# 或使用 yarn
yarn dev
```

项目启动后默认运行在 **http://localhost:5173/**

---

## 📂 项目结构

```
src/
└── components/
    ├── MetaMaskLogin/        # MetaMask 登录组件
    └── TronLinkLogin/        # TronLink 登录组件
index.tsx                     # 项目入口
```

---

## 🔑 组件说明

### MetaMaskLogin

- 功能：检测并连接 MetaMask 钱包。  
- 特点：
  - 只选择 MetaMask Provider，避免 Coinbase 等钱包干扰  
  - 自动检测账户切换和断开连接事件  
  - 成功连接后回调 `onSuccess(account)`  

使用示例：

```tsx
import MetaMaskLogin from "./components/MetaMaskLogin";

<MetaMaskLogin onSuccess={(account) => console.log("MetaMask:", account)} />
```

---

### TronLinkLogin

- 功能：连接 TronLink 插件钱包（TRON 网络）。  
- 特点：
  - **点击按钮时才触发连接**（不会自动连接）  
  - 支持复制钱包地址  
  - 监听账户切换/退出/断开事件  
  - 成功连接后回调 `onSuccess(account)`  

使用示例：

```tsx
import TronLinkConnect from "./components/TronLinkLogin/TronLinkConnect";

<TronLinkConnect onSuccess={(account) => console.log("TronLink:", account)} />
```

---

## ⚠️ 注意事项

1. 使用前请确保浏览器已安装对应的钱包插件：  
   - [MetaMask](https://metamask.io/)  
   - [TronLink](https://www.tronlink.org/)  

2. TronLink 插件必须 **解锁并登录账号** 才能正常使用。  

3. 如果遇到 **“DApp requests are too frequent”** 错误，请稍等几秒后再点击登录。  

---

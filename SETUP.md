# 项目设置指南

## 前置要求

1. **Node.js**: 版本 16 或更高
2. **npm** 或 **yarn**: 包管理器
3. **Expo CLI**: 全局安装（可选）
   ```bash
   npm install -g expo-cli
   ```

## 安装步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 准备资源文件

在 `assets/` 目录下添加以下图片文件：

- `icon.png` (1024x1024px) - 应用图标
- `splash.png` - 启动画面
- `adaptive-icon.png` (1024x1024px) - Android自适应图标
- `favicon.png` - Web图标

> 注意：如果暂时没有这些文件，可以先创建占位图片，应用仍然可以运行。

### 3. 运行项目

```bash
# 启动开发服务器
npm start

# 在iOS模拟器运行
npm run ios

# 在Android模拟器运行
npm run android

# 在Web浏览器运行
npm run web
```

### 4. 在手机上测试

#### 方式一：使用 Expo Go（推荐，无需登录）

1. **在手机上安装 Expo Go 应用**
   - iOS: 在 App Store 搜索 "Expo Go" 并安装
   - Android: 在 Google Play 搜索 "Expo Go" 并安装
   - **不需要登录账号即可使用**

2. **启动开发服务器**
   ```bash
   npm start
   ```
   
   运行后，终端会显示：
   ```
   › Metro waiting on exp://192.168.x.x:8081
   › Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
   
   ┌──────────────────────────────────────────────────────────────┐
   │                                                              │
   │   ██████████████████████████████████████████████████████   │
   │   ██████████████████████████████████████████████████████   │
   │   ██████████████████████████████████████████████████████   │
   │   ...（二维码）...                                           │
   │                                                              │
   └──────────────────────────────────────────────────────────────┘
   ```

3. **扫描二维码**
   - **iOS用户**: 直接用iPhone自带的"相机"应用扫描二维码
   - **Android用户**: 打开 Expo Go 应用，点击"Scan QR code"扫描
   
4. **等待加载**
   - 扫描后，Expo Go会自动打开并加载你的应用
   - 首次加载可能需要一些时间下载依赖

#### 方式二：使用 Expo Go（需要登录，可同步项目）

如果你有 Expo 账号并想同步项目：
1. 在电脑终端登录：`npx expo login`
2. 在手机 Expo Go 应用中登录相同账号
3. 在电脑运行 `npm start` 后，项目会自动出现在手机的 Expo Go 中

**注意**: 登录不是必需的，直接用二维码扫描就能使用。

## 开发环境设置

### iOS开发（Mac only）

需要安装 Xcode 和 iOS Simulator：

```bash
# 安装 Xcode Command Line Tools
xcode-select --install
```

### Android开发

需要安装 Android Studio 和 Android SDK：

1. 下载并安装 [Android Studio](https://developer.android.com/studio)
2. 配置 Android SDK
3. 设置环境变量：
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

## 项目结构说明

```
homework_planner/
├── src/
│   ├── screens/          # 所有屏幕组件
│   ├── components/       # 可复用组件
│   ├── navigation/       # 导航配置
│   ├── services/         # 业务逻辑服务
│   ├── types/            # TypeScript类型
│   ├── utils/            # 工具函数
│   └── constants/        # 常量定义
├── assets/               # 静态资源
├── App.tsx               # 应用入口
└── package.json          # 项目配置
```

## 下一步

1. 添加应用图标和启动画面
2. 自定义主题颜色（`src/constants/colors.ts`）
3. 根据需要扩展功能
4. 准备发布到应用商店

## 常见问题

### 端口被占用

如果 19000 或 8081 端口被占用，可以：

```bash
# 使用不同端口
expo start --port 19001
```

### 缓存问题

如果遇到奇怪的问题，尝试清除缓存：

```bash
npm start -- --clear
```

### 依赖问题

如果安装依赖时出错，尝试：

```bash
# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装
npm install
```


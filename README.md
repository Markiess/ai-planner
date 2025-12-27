# 作业规划应用 (Homework Planner)

一个智能作业规划移动应用，帮助用户管理作业任务，并通过AI智能推荐优化学习计划。

## 功能特性

- 📝 **作业管理**: 添加、编辑、删除作业，包含标题、描述、截止日期、优先级等信息
- 📊 **智能排序**: 基于截止日期和优先级自动排序
- 🤖 **AI推荐**: 智能分析作业列表，推荐最佳完成顺序
- ⏰ **时间管理**: 显示剩余时间、紧急任务提醒
- ✅ **任务追踪**: 标记完成状态，追踪学习进度
- 🎨 **现代化UI**: 美观直观的用户界面

## 技术栈

- **React Native** + **Expo**: 跨平台移动应用框架
- **TypeScript**: 类型安全的开发体验
- **React Navigation**: 应用导航和路由
- **AsyncStorage**: 本地数据存储
- **date-fns**: 日期处理库

## 项目结构

```
homework_planner/
├── src/
│   ├── screens/           # 屏幕组件
│   │   ├── HomeScreen.tsx           # 主页
│   │   ├── HomeworkListScreen.tsx   # 作业列表
│   │   ├── AddHomeworkScreen.tsx    # 添加作业
│   │   ├── HomeworkDetailScreen.tsx # 作业详情
│   │   └── AISuggestionsScreen.tsx  # AI推荐
│   ├── components/        # 可复用组件
│   ├── navigation/        # 导航配置
│   │   └── AppNavigator.tsx
│   ├── services/          # 业务逻辑服务
│   │   ├── homeworkService.ts       # 作业管理服务
│   │   └── aiAgentService.ts        # AI推荐服务
│   ├── types/             # TypeScript类型定义
│   │   └── index.ts
│   ├── utils/             # 工具函数
│   │   └── storage.ts
│   └── constants/         # 常量定义
│       └── colors.ts
├── App.tsx                # 应用入口
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript配置
├── app.json               # Expo配置
└── README.md              # 项目文档
```

## 开始使用

### 安装依赖

```bash
npm install
```

### 运行项目

```bash
# 启动开发服务器
npm start

# 在iOS模拟器运行
npm run ios

# 在Android模拟器运行
npm run android
```

### 构建发布

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## 核心功能说明

### 1. 作业管理
- 用户可以添加作业，包含标题、科目、截止日期、优先级、预计完成时间等信息
- 支持编辑和删除作业
- 自动计算剩余时间和紧急程度

### 2. AI智能推荐
- 基于优先级（高/中/低）和截止日期智能排序
- 生成推荐理由和提示建议
- 提供任务拆解步骤建议

### 3. 数据存储
- 使用AsyncStorage进行本地数据持久化
- 数据以JSON格式存储

## 后续开发建议

1. **AI功能增强**
   - 集成真实的AI API（如OpenAI）
   - 提供更详细的个性化建议
   - 学习用户习惯，优化推荐算法

2. **功能扩展**
   - 添加提醒通知功能
   - 支持作业分类和标签
   - 添加统计和分析功能
   - 支持数据云同步

3. **用户体验**
   - 添加深色模式支持
   - 优化动画和过渡效果
   - 支持手势操作

4. **发布准备**
   - 配置App Store和Google Play的应用信息
   - 添加应用图标和启动画面
   - 配置应用权限
   - 准备应用截图和描述

## 许可证

MIT License


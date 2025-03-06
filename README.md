# AGCM

## 介绍

AGCM 是一个智能的 Git 提交消息生成工具，基于 AI 技术，帮助开发者快速生成规范的 commit message。

AGCM 是 "AI Generate Commit Message"的缩写。

## 功能特性

-   🤖 基于 AI 技术，智能生成 commit message
-   🎯 支持 Conventional Commits 规范
-   🌐 支持中英文双语界面
-   ⚡ 快速且易用的 VSCode 插件
-   🛡️ 完善的错误处理机制
-   🔄 支持自定义 AI 服务配置

## 技术架构

### 核心模块

- **Git 变更检测**：通过 GitService 模块实时监测工作区文件变更
- **AI 消息生成**：AIService 模块负责与 AI API 通信，生成规范的提交信息
- **消息处理**：MessageGenerator 模块处理 AI 响应，确保生成的消息符合规范
- **配置管理**：ConfigurationManager 模块管理插件配置和用户偏好

### 工作流程

1. 检测 Git 暂存区变更
2. 格式化变更信息
3. 调用 AI 服务生成提交消息
4. 解析和格式化 AI 响应
5. 填充 Git 提交框

## 配置项

在 VSCode 设置中可以配置以下选项：

-   `agcm.apiKey`: AI 服务的 API 密钥
-   `agcm.language`: 界面语言 (支持 en/zh-CN)
-   `agcm.commitStyle`: 提交消息风格 (conventional/simple)

## 使用方法

1. 在 VSCode 中安装 AGCM 插件
2. 配置 AI API 密钥
3. 在 Git 暂存区有文件时，使用命令面板执行"Generate Commit Message"命令
4. 插件将自动分析改动并生成合适的提交消息

## 技术特点

### 错误处理

- API 调用超时自动中断（30秒超时限制）
- API 密钥验证和余额不足提示
- 变更检测异常处理
- 国际化错误消息

### 消息生成

- 支持 Conventional Commits 规范
- 智能提取提交类型和范围
- 自动格式化提交消息
- 支持长文本提交说明

### 国际化支持

- 支持中英文界面切换
- 错误消息国际化
- 配置项说明双语支持

## 开发

1. 克隆项目
2. 安装依赖：`npm install`
3. 在 VSCode 中打开项目
4. 按 F5 启动调试

## 依赖项

- VS Code API
- Git Extension API
- TypeScript

## 许可证

MIT

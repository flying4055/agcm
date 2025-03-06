# AGCM

## 介绍

AGCM 是一个智能的 Git 提交消息生成工具，**基于强大的 Deepseek AI 大语言模型技术**，帮助开发者快速生成规范、专业的 commit message。通过深度学习和自然语言处理能力，AGCM 能够智能理解代码变更上下文，生成符合团队规范的高质量提交信息。

AGCM 是 "AI Generate Commit Message"的缩写，代表着 AI 驱动的提交消息生成新时代。

## 功能特性

-   🤖 **基于 Deepseek AI 技术**，智能分析代码变更并生成精准的 commit message
-   🎯 完美支持 Conventional Commits 规范，提升代码库的可维护性
-   🌐 支持中英文双语界面，满足国际化团队需求
-   ⚡ 快速且易用的 VSCode 插件，无缝集成到开发工作流
-   🛡️ 完善的错误处理机制，确保稳定可靠的使用体验
-   🔄 支持自定义 Deepseek AI 服务配置，灵活适应不同场景

## 技术架构

### 核心模块

- **Git 变更检测**：通过 GitService 模块实时监测工作区文件变更
- **Deepseek AI 消息生成**：AIService 模块负责与 Deepseek AI API 通信，利用先进的语言模型生成规范的提交信息
- **智能消息处理**：MessageGenerator 模块处理 Deepseek AI 响应，确保生成的消息符合规范并具有语义准确性
- **配置管理**：ConfigurationManager 模块管理插件配置和用户偏好，优化 AI 服务体验

### 工作流程

1. 检测 Git 暂存区变更
2. 智能格式化变更信息，提取关键上下文
3. 调用 Deepseek AI 服务分析代码变更并生成提交消息
4. 解析和格式化 AI 响应，确保符合选定的提交规范
5. 自动填充 Git 提交框，提升开发效率

## 配置项

在 VSCode 设置中可以配置以下选项：

-   `agcm.apiKey`: Deepseek AI 服务的 API 密钥
-   `agcm.language`: 界面语言 (支持 en/zh-CN)
-   `agcm.commitStyle`: 提交消息风格 (conventional/simple)

## 使用方法

1. 在 VSCode 中安装 AGCM 插件
2. 配置 Deepseek AI API 密钥
3. 在 Git 暂存区有文件时，使用命令面板执行"Generate Commit Message"命令
4. 插件将自动调用 Deepseek AI 分析改动并生成专业、规范的提交消息

## 技术特点

### Deepseek AI 能力

- 基于先进的大语言模型，深度理解代码语义和变更意图
- 智能识别代码重构、功能添加、bug修复等不同类型的变更
- 自动提取关键信息，生成简洁明了的提交描述
- 支持多种编程语言和框架的代码分析

### 错误处理

- Deepseek AI API 调用超时自动中断（30秒超时限制）
- API 密钥验证和余额不足提示
- 变更检测异常处理
- 国际化错误消息

### 消息生成

- 支持 Conventional Commits 规范
- 智能提取提交类型和范围
- 自动格式化提交消息
- 支持长文本提交说明，包含详细的变更解释

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
- Deepseek AI API
- TypeScript

## 许可证

MIT

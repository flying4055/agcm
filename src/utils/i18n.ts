import * as vscode from 'vscode';

interface Translations {
    [key: string]: string;
}

export class I18n {
    private static translations: { [lang: string]: Translations } = {
        'zh-CN': {
            "generateSuccess": "提交消息生成成功！",
            "generateError": "生成提交消息失败：{0}",
            "gitNotFound": "未找到Git扩展",
            "repoNotFound": "未找到Git仓库",
            "defaultCommitTitle": "生成的提交消息",
            "configureNow": "立即配置",
            "apiKeyNotConfigured": "API密钥未配置",
            "generating": "正在生成提交消息...",
            "noChangesDetected": "未检测到任何变更",
            "noValidChanges": "没有有效的变更内容",
            "aiEmptyResponse": "AI返回的消息为空",
            "commitMessageTooLong": "提交消息超过2000字符限制",
            "unknownError": "发生未知错误",
            "invalidChangesFormat": "变更信息格式无效",
            "invalidAIMessage": "AI返回的消息格式无效",
            "commitTitleTooLong": "提交标题超过100字符限制"
        },
        'en': {
            "generateSuccess": "Commit message generated successfully!",
            "generateError": "Failed to generate commit message: {0}",
            "gitNotFound": "Git extension not found",
            "repoNotFound": "No Git repository found",
            "defaultCommitTitle": "Generated commit message",
            "configureNow": "Configure Now",
            "apiKeyNotConfigured": "API key not configured",
            "generating": "Generating commit message...",
            "noChangesDetected": "No changes detected",
            "noValidChanges": "No valid changes found",
            "aiEmptyResponse": "Empty response from AI",
            "commitMessageTooLong": "Commit message exceeds 2000 characters limit",
            "unknownError": "An unknown error occurred",
            "invalidChangesFormat": "Invalid changes format",
            "invalidAIMessage": "Invalid AI message format",
            "commitTitleTooLong": "Commit title exceeds 100 characters limit"
        }
    };

    private static getCurrentLanguage(): string {
        const config = vscode.workspace.getConfiguration('agcm');
        return config.get<string>('language') || 'zh-CN';
    }

    public static t(key: string, ...args: string[]): string {
        const lang = this.getCurrentLanguage();
        let text = this.translations[lang]?.[key] || this.translations['en']?.[key] || key;
        
        args.forEach((arg, index) => {
            text = text.replace(`{${index}}`, arg);
        });
        
        return text;
    }
}
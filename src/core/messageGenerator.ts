import { GitService } from "./gitService";
import { AIService } from "./aiService";
import { CommitChanges } from "../models/message";
import { I18n } from "../utils/i18n";

export class MessageGenerator {
    private gitService: GitService;
    private aiService: AIService;

    constructor(config: { apiKey: string; baseURL?: string }) {
        this.gitService = new GitService();
        this.aiService = new AIService(config);
    }

    // 生成提交消息
    public async generate(): Promise<string> {
        try {
            // 获取Git变更信息
            const changes = await this.gitService.getChanges();
            console.log("Git变更信息:", changes);
            // 验证是否有变更
            if (!changes || (!changes.additions.length && !changes.modifications.length && !changes.deletions.length)) {
                throw new Error(I18n.t("noChangesDetected"));
            }

            // 将变更信息转换为文本格式
            const changesText = this.formatChangesForAI(changes);
            console.log("格式化后的变更信息:", changesText);
            if (!changesText.trim()) {
                throw new Error(I18n.t("noValidChanges"));
            }

            // 使用AI生成提交消息
            const aiGeneratedMessage = await this.aiService.generateCommitMessage(changesText);
            console.log("AI生成的原始消息:", aiGeneratedMessage);
            if (!aiGeneratedMessage) {
                throw new Error(I18n.t("aiEmptyResponse"));
            }
            // 提示生成成功
            return aiGeneratedMessage;
        } catch (error: unknown) {
            // 处理错误消息，避免重复显示
            const errorMessage = error instanceof Error ? 
                (error.message.includes('API balance insufficient') ? 
                    I18n.t("generateError", "API额度不足，请检查您的API余额") :
                    (error.message.startsWith(I18n.t("generateError").split(":")[0]) ? 
                        error.message.split(":").pop()?.trim() || error.message : 
                        I18n.t("generateError", error.message)
                    )
                ) : 
                I18n.t("generateError", I18n.t("unknownError"));
            throw new Error(errorMessage);
        }
    }

    // 将变更信息转换为文本格式
    private formatChangesForAI(changes: CommitChanges): string {
        if (!changes || typeof changes !== 'object') {
            throw new Error(I18n.t("invalidChangesFormat"));
        }

        const parts: string[] = [];

        if (Array.isArray(changes.additions) && changes.additions.length > 0) {
            parts.push("新增文件：\n" + changes.additions.map((file) => `- ${file}`).join("\n"));
        }

        if (Array.isArray(changes.modifications) && changes.modifications.length > 0) {
            parts.push("修改文件：\n" + changes.modifications.map((file) => `- ${file}`).join("\n"));
        }

        if (Array.isArray(changes.deletions) && changes.deletions.length > 0) {
            parts.push("删除文件：\n" + changes.deletions.map((file) => `- ${file}`).join("\n"));
        }

        return parts.join("\n\n");
    }
}

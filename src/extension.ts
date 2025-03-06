import * as vscode from "vscode";
import { MessageGenerator } from "./core/messageGenerator";
import { ConfigurationManager } from "./utils/configManager";
import { I18n } from "./utils/i18n";

export function activate(context: vscode.ExtensionContext) {
    const configManager = new ConfigurationManager(context);
    const messageGenerator = new MessageGenerator(configManager.getAIConfig());

    let generateCommand = vscode.commands.registerCommand("agcm.generateCommitMessage", async () => {
        try {
            // 验证API密钥
            if (!configManager.validateApiKey()) {
                const configureNow = I18n.t("configureNow");
                const result = await vscode.window.showErrorMessage(I18n.t("apiKeyNotConfigured"), configureNow);
                if (result === configureNow) {
                    configManager.openSettings();
                }
                return;
            }

            const gitExtension = vscode.extensions.getExtension("vscode.git");
            if (!gitExtension) {
                throw new Error(I18n.t("gitNotFound"));
            }

            const git = gitExtension.exports.getAPI(1);
            const repository = git.repositories[0];
            if (!repository) {
                throw new Error(I18n.t("repoNotFound"));
            }

            // 显示加载状态
            const loadingMessage = await vscode.window.withProgress(
                {
                    location: vscode.ProgressLocation.Notification,
                    title: I18n.t("generating"),
                    cancellable: false,
                },
                async (progress) => {
                    progress.report({ increment: 30 });
                    // 生成提交信息
                    const message = await messageGenerator.generate();
                    progress.report({ increment: 70 });
                    return message;
                }
            );

            // 将生成的消息填入Git提交框
            repository.inputBox.value = loadingMessage;

            // 显示成功提示
            vscode.window.showInformationMessage(I18n.t("generateSuccess"));
        } catch (error) {
            vscode.window.showErrorMessage(I18n.t("generateError", (error as Error).message));
        }
    });

    context.subscriptions.push(generateCommand);
}

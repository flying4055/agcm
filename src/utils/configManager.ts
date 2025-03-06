import * as vscode from 'vscode';
import { AIConfig } from '../models/config';

export class ConfigurationManager {
    constructor(private context: vscode.ExtensionContext) {}

    // 获取配置
    public getConfiguration() {
        return vscode.workspace.getConfiguration('agcm');
    }

    // 更新配置
    public async updateConfiguration(section: string, value: any): Promise<void> {
        if (!section || typeof section !== 'string') {
            throw new Error('Invalid configuration section');
        }

        const config = this.getConfiguration();
        try {
            await config.update(section, value, true);
        } catch (error) {
            throw new Error(`Failed to update configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    // 获取完整的AI配置
    public getAIConfig(): AIConfig {
        const config = this.getConfiguration();
        const apiKey = config.get<string>('apiKey') || '';
        const baseURL = config.get<string>('baseURL') || 'https://api.deepseek.com/v1';

        return {
            apiKey,
            baseURL
        };
    }

    // 获取API密钥
    public getApiKey(): string {
        const config = this.getConfiguration();
        const apiKey = config.get<string>('apiKey');
        return apiKey || '';
    }

    // 验证API密钥
    public validateApiKey(): boolean {
        const apiKey = this.getApiKey();
        return typeof apiKey === 'string' && apiKey.trim().length > 0;
    }

    // 验证基础URL配置
    public validateBaseURL(): boolean {
        const config = this.getConfiguration();
        const baseURL = config.get<string>('baseURL');
        try {
            if (!baseURL) return true; // 使用默认值
            new URL(baseURL);
            return true;
        } catch {
            return false;
        }
    }

    // 打开设置页面
    public openSettings() {
        vscode.commands.executeCommand('workbench.action.openSettings', 'agcm');
    }
}
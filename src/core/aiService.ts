import { AIConfig } from '../models/config';

export class AIService {
    private apiKey: string;
    private baseURL: string;

    constructor(config: AIConfig) {
        this.apiKey = config.apiKey;
        this.baseURL = config.baseURL || 'https://api.deepseek.com';
    }

    async generateCommitMessage(changes: string): Promise<string> {
        try {
            const response = await this.callAIAPI(changes);
            return response;
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Failed to generate commit message: ${error.message}`);
            }
            throw new Error('Failed to generate commit message: Unknown error');
        }
    }

    private async callAIAPI(prompt: string): Promise<string> {
        if (!this.apiKey) {
            throw new Error('API key is not configured');
        }

        if (!prompt.trim()) {
            throw new Error('Empty prompt is not allowed');
        }

        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        };

        const messages = [
            {
                role: 'system',
                content: `您是一个 Git 提交消息生成器，请根据代码更改生成符合 Conventional Commits 规范的提交消息。具体要求如下：
1. **类型**：选择合适的类型，例如 feat（新功能）、fix、docs（文档更新）、style（代码格式）、refactor（重构）、test（测试）、chore（构建/工具）。
2. **标题**：第一行用作标题，以 <类型>: <标题> 格式简要描述更改。
3. **正文**：正文部分可以使用列表、引语等详细描述更改的细节。
4. **仅返回提交消息**：无需额外解释，只需生成提交消息。
5. **格式**：严格按照 Conventional Commits 规范编写，包括类型、标题和正文。`
            },
            {
                role: 'user',
                content: `请根据以下代码变更生成提交信息: \n${prompt}`
            }
        ];
        console.log('AI Request Messages:', messages);

        try {
            const endpoint = `${this.baseURL}/chat/completions`;
            const requestData = {
                model: 'deepseek-chat',
                messages: messages,
                temperature: 0.7,
                max_tokens: 1024
            };
            console.log('AI Request Data:', requestData);

            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 30000); // 30秒超时

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(requestData),
                    signal: controller.signal
                });

                if (!response.ok) {
                    const statusCode = response.status;
                    const errorData = await response.json().catch(() => ({}));
                    const errorMessage = errorData?.error?.message || response.statusText;

                    if (statusCode === 401) {
                        throw new Error('Invalid API key');
                    } else if (statusCode === 429) {
                        throw new Error('Rate limit exceeded');
                    } else if (errorMessage.includes('Insufficient Balance')) {
                        throw new Error('API balance insufficient');
                    }

                    throw new Error(`API request failed: ${errorMessage}`);
                }

                const data = await response.json();
                console.log('AI Response Data:', data);
                
                if (!data?.choices?.[0]?.message?.content) {
                    throw new Error('Invalid response format from AI API');
                }

                return data.choices[0].message.content.trim();
            } finally {
                clearTimeout(timeout);
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error('API request timeout');
                }
                throw error;
            }
            throw new Error('Unknown error occurred during API request');
        }
    }
}
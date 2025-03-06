import * as vscode from 'vscode';
import { CommitChanges } from '../models/message';

export class GitService {
    async getChanges(): Promise<CommitChanges> {
        const gitExtension = vscode.extensions.getExtension('vscode.git');
        if (!gitExtension) {
            throw new Error('Git extension not found');
        }

        // 获取 git 变更
        const api = gitExtension.exports.getAPI(1);
        if (!api.repositories || api.repositories.length === 0) {
            throw new Error('No git repository found');
        }

        // 如果有多个仓库，使用当前活动的工作区所在的仓库
        const activeRepo = this.getActiveRepository(api.repositories);
        if (!activeRepo) {
            throw new Error('No active git repository found');
        }

        // 获取暂存区和工作区的变更
        const stagedChanges = activeRepo.state.indexChanges;
        const workingTreeChanges = activeRepo.state.workingTreeChanges;
        console.log('获取到的暂存区变更数量:', stagedChanges?.length || 0);
        console.log('获取到的工作区变更数量:', workingTreeChanges?.length || 0);

        // 如果没有任何变更，返回空对象
        if ((!stagedChanges || stagedChanges.length === 0) && (!workingTreeChanges || workingTreeChanges.length === 0)) {
            console.log('暂存区和工作区都没有变更');
            return {
                additions: [],
                deletions: [],
                modifications: []
            };
        }

        // 解析暂存区的变更
        const changes: CommitChanges = {
            additions: [],
            deletions: [],
            modifications: []
        };

        // 合并暂存区和工作区的变更
        const allChanges = [...(stagedChanges || []), ...(workingTreeChanges || [])];
        for (const change of allChanges) {
            if (!change.uri || !change.uri.fsPath) {
                console.warn('无效的变更对象: 缺少uri或fsPath');
                continue;
            }

            try {
                // 使用path.relative获取相对路径，以确保跨平台兼容性
                const filePath = change.uri.fsPath.replace(activeRepo.rootUri.fsPath, '').replace(/^\\/g, '');
                console.log(`处理文件: ${filePath}, 状态: ${change.status}`);
                
                switch (change.status) {
                    case 1: // 新增
                        console.log(`文件新增: ${filePath}`);
                        changes.additions.push(filePath);
                        break;
                    case 3: // 删除
                        console.log(`文件删除: ${filePath}`);
                        changes.deletions.push(filePath);
                        break;
                    case 2: // 修改
                        console.log(`文件修改: ${filePath}`);
                        changes.modifications.push(filePath);
                        break;
                    case 4: // 重命名
                        console.log(`文件重命名: ${filePath}`);
                        changes.modifications.push(filePath);
                        break;
                    case 5: // 复制
                        console.log(`文件复制: ${filePath}`);
                        changes.modifications.push(filePath);
                        break;
                    default:
                        console.warn(`未知的变更状态: ${change.status}, 文件: ${filePath}`);
                }
            } catch (error) {
                console.error('处理变更时出错:', error);
                continue;
            }
        }

        console.log('变更统计:', {
            新增: changes.additions.length,
            删除: changes.deletions.length,
            修改: changes.modifications.length
        });
        return changes;
    }

    private getActiveRepository(repositories: any[]): any {
        if (repositories.length === 1) {
            return repositories[0];
        }

        // 获取当前活动的编辑器
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return repositories[0]; // 如果没有活动编辑器，返回第一个仓库
        }

        // 查找包含当前文件的仓库
        const activeFilePath = activeEditor.document.uri.fsPath;
        for (const repo of repositories) {
            if (activeFilePath.startsWith(repo.rootUri.fsPath)) {
                return repo;
            }
        }

        return repositories[0]; // 如果找不到匹配的仓库，返回第一个仓库
    }

    async commit(message: string): Promise<void> {
        if (!message || !message.trim()) {
            throw new Error('Commit message cannot be empty');
        }

        const gitExtension = vscode.extensions.getExtension('vscode.git');
        if (!gitExtension) {
            throw new Error('Git extension not found');
        }

        const api = gitExtension.exports.getAPI(1);
        if (!api.repositories || api.repositories.length === 0) {
            throw new Error('No git repository found');
        }

        const activeRepo = this.getActiveRepository(api.repositories);
        if (!activeRepo) {
            throw new Error('No active git repository found');
        }

        try {
            await activeRepo.commit(message);
        } catch (error) {
            throw new Error(`Failed to commit: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}
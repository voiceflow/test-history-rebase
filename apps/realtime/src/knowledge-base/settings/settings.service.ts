import { Inject, Injectable } from '@nestjs/common';
import { AIModel,KBSettingsChunkStrategy, KBSettingsPromptMode, KnowledgeBaseSettings } from '@voiceflow/dtos';
import { NotFoundException } from '@voiceflow/exception';
import { KnowledgeBaseORM, ProjectEntity } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';
import { ProjectService } from '@/project/project.service';
import { VersionService } from '@/version/version.service';

@Injectable()
export class KnowledgeBaseSettingsService extends MutableService<KnowledgeBaseORM> {
  private DEFAULT_SETTINGS: KnowledgeBaseSettings = {
    summarization: {
      prompt: '',
      mode: KBSettingsPromptMode.PROMPT,
      model: AIModel.GPT_3_5_TURBO,
      temperature: 0.1,
      system:
        "You are an FAQ AI chat assistant. Information will be provided to help answer the user's questions. Always summarize your response to be as brief as possible and be extremely concise. Your responses should be fewer than a couple of sentences.",
    },
    chunkStrategy: {
      type: KBSettingsChunkStrategy.RECURSIVE_TEXT_SPLITTER,
      size: 1200,
      overlap: 200,
    },
    search: {
      limit: 3,
      metric: 'IP',
    },
  };

  constructor(
    @Inject(KnowledgeBaseORM)
    protected readonly orm: KnowledgeBaseORM,
    @Inject(VersionService)
    protected readonly version: VersionService,
    @Inject(ProjectService)
    protected readonly project: ProjectService
  ) {
    super();
  }

  async getSettings(assistantID: string): Promise<KnowledgeBaseSettings> {
    const settings = await this.orm.findSettings(assistantID);

    if (!settings) {
      await this.updateSettings(assistantID, this.DEFAULT_SETTINGS);
      return this.DEFAULT_SETTINGS;
    }

    return settings;
  }

  async updateSettings(assistantID: string, newSettings: KnowledgeBaseSettings): Promise<void> {
    await this.orm.updateSettings(assistantID, newSettings);
  }

  async getVersionSettings(versionID: string): Promise<KnowledgeBaseSettings> {
    const versionDocument = await this.version.findOne(versionID);
    if (!versionDocument) {
      throw new NotFoundException('Version not found');
    }

    const versionSettings = versionDocument?.knowledgeBase?.settings;
    if (versionSettings) {
      return versionSettings;
    }

    // support both options for backward compatibility
    const projectID = versionDocument?.projectID.toHexString();
    let projectDocument: ProjectEntity | null = null;
    if (projectID) {
      projectDocument = await this.project.findOne(projectID);
    }

    const projectSettings = projectDocument?.knowledgeBase?.settings;
    if (projectSettings) {
      // copy data from project level to version level if version level is empty
      await this.updateVersionSettings(versionID, projectSettings);
      return projectSettings;
    }

    // apply default settings if none are available
    await this.updateVersionSettings(versionID, this.DEFAULT_SETTINGS);
    return this.DEFAULT_SETTINGS;
  }

  async updateVersionSettings(versionID: string, newSettings: KnowledgeBaseSettings) {
    await this.version.updateKnowledgeBaseSettings(versionID, newSettings);
  }
}

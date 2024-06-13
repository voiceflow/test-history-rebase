import { Inject, Injectable } from '@nestjs/common';
import { AI_MODEL_PARAMS, KnowledgeBaseSettings } from '@voiceflow/dtos';
import { NotFoundException } from '@voiceflow/exception';
import { UnleashFeatureFlagService } from '@voiceflow/nestjs-common';
import { KnowledgeBaseORM, ProjectEntity, ProjectORM } from '@voiceflow/orm-designer';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { FeatureFlag } from '@voiceflow/realtime-sdk/backend';

import { CacheService, type KeyValueStrategy } from '@/cache/cache.service';
import { MutableService } from '@/common';
import { ProjectService } from '@/project/project.service';
import { VersionService } from '@/version/version.service';

@Injectable()
export class KnowledgeBaseSettingsService extends MutableService<KnowledgeBaseORM> {
  private static getKbSettingsKey({ assistantID }: { assistantID: string }): string {
    return `kb-settings:${assistantID}`;
  }

  private settingsCache: KeyValueStrategy<typeof KnowledgeBaseSettingsService.getKbSettingsKey>;

  // eslint-disable-next-line max-params
  constructor(
    @Inject(CacheService)
    private readonly cache: CacheService,
    @Inject(UnleashFeatureFlagService)
    private readonly unleash: UnleashFeatureFlagService,
    @Inject(KnowledgeBaseORM)
    protected readonly orm: KnowledgeBaseORM,
    @Inject(ProjectORM)
    protected readonly projectORM: ProjectORM,
    @Inject(VersionService)
    protected readonly version: VersionService,
    @Inject(ProjectService)
    protected readonly project: ProjectService
  ) {
    super();
    this.settingsCache = this.cache.keyValueStrategyFactory({
      expire: 60 * 60,
      keyCreator: KnowledgeBaseSettingsService.getKbSettingsKey,
    });
  }

  async getSettings(assistantID: string): Promise<KnowledgeBaseSettings> {
    const settings = await this.orm.findSettings(assistantID);

    if (!settings) {
      await this.updateSettings(assistantID, Realtime.KB_SETTINGS_DEFAULT);
      return Realtime.KB_SETTINGS_DEFAULT;
    }

    return settings;
  }

  async updateSettings(assistantID: string, newSettings: KnowledgeBaseSettings): Promise<void> {
    const updatedSettings = { ...newSettings };

    if (updatedSettings.summarization.maxTokens) {
      // maxTokens can't be higher than the model limit
      updatedSettings.summarization.maxTokens = Math.min(
        updatedSettings.summarization.maxTokens,
        AI_MODEL_PARAMS[updatedSettings.summarization.model].maxTokens
      );
    }

    await this.orm.updateSettings(assistantID, newSettings);

    await this.updateCachedSettings(assistantID, newSettings);
  }

  async updateCachedSettings(assistantID: string, settings: KnowledgeBaseSettings) {
    await this.settingsCache.set({ assistantID }, JSON.stringify(settings));
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
    await this.updateVersionSettings(versionID, Realtime.KB_SETTINGS_DEFAULT);
    return Realtime.KB_SETTINGS_DEFAULT;
  }

  async updateVersionSettings(versionID: string, newSettings: KnowledgeBaseSettings) {
    const updatedSettings = { ...newSettings };

    if (updatedSettings.summarization.maxTokens) {
      // maxTokens can't be higher than the model limit
      updatedSettings.summarization.maxTokens = Math.min(
        updatedSettings.summarization.maxTokens,
        AI_MODEL_PARAMS[updatedSettings.summarization.model].maxTokens
      );
    }

    await this.version.updateKnowledgeBaseSettings(versionID, newSettings);

    const versionDocument = await this.version.findOne(versionID);
    if (versionDocument) {
      await this.updateCachedSettings(versionDocument.projectID.toString(), newSettings);
    }
  }

  async getProjectSettingsFromCache(projectID: string): Promise<KnowledgeBaseSettings | undefined> {
    const cachedSettings = await this.settingsCache.get({ assistantID: projectID });

    if (cachedSettings) {
      return JSON.parse(cachedSettings);
    }

    return undefined;
  }

  async getProjectSettings(projectID: string): Promise<KnowledgeBaseSettings> {
    const cachedSettings = await this.getProjectSettingsFromCache(projectID);

    if (cachedSettings) {
      return cachedSettings;
    }

    const { devVersion, workspaceID } = await this.projectORM.getVersionAndWorkspaceID(projectID);

    if (this.unleash.isEnabled(FeatureFlag.VERSIONED_KB_SETTINGS, { workspaceID }) && devVersion) {
      const versionSettings = await this.getVersionSettings(devVersion);
      await this.updateCachedSettings(projectID, versionSettings);

      return versionSettings;
    }

    const settings = await this.getSettings(projectID);
    await this.updateCachedSettings(projectID, settings);

    return settings;
  }
}

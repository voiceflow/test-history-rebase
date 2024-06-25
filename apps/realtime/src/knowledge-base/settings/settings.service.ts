import { Inject, Injectable } from '@nestjs/common';
import { AI_MODEL_PARAMS, KnowledgeBaseSettings } from '@voiceflow/dtos';
import { UnleashFeatureFlagService } from '@voiceflow/nestjs-common';
import { KnowledgeBaseORM, ProjectORM, VersionORM } from '@voiceflow/orm-designer';
import { FeatureFlag, KB_SETTINGS_DEFAULT } from '@voiceflow/realtime-sdk/backend';

import { CacheService, type KeyValueStrategy } from '@/cache/cache.service';
import { MutableService } from '@/common';

@Injectable()
export class KnowledgeBaseSettingsService extends MutableService<KnowledgeBaseORM> {
  private static getKBSettingsKey({ assistantID }: { assistantID: string }): string {
    return `kb-settings:${assistantID}`;
  }

  private static getKBEnvironmentSettingsKey({ environmentID }: { environmentID: string }): string {
    return `kb-environment-settings:${environmentID}`;
  }

  private settingsCache: KeyValueStrategy<typeof KnowledgeBaseSettingsService.getKBSettingsKey>;

  private environmentSettingsCache: KeyValueStrategy<typeof KnowledgeBaseSettingsService.getKBEnvironmentSettingsKey>;

  constructor(
    @Inject(KnowledgeBaseORM)
    protected readonly orm: KnowledgeBaseORM,
    @Inject(ProjectORM)
    protected readonly projectORM: ProjectORM,
    @Inject(VersionORM)
    protected readonly versionORM: VersionORM,
    @Inject(CacheService)
    private readonly cache: CacheService,
    @Inject(UnleashFeatureFlagService)
    private readonly unleash: UnleashFeatureFlagService
  ) {
    super();

    this.settingsCache = this.cache.keyValueStrategyFactory({
      expire: 60 * 60,
      keyCreator: KnowledgeBaseSettingsService.getKBSettingsKey,
    });
    this.environmentSettingsCache = this.cache.keyValueStrategyFactory({
      expire: 60 * 60,
      keyCreator: KnowledgeBaseSettingsService.getKBEnvironmentSettingsKey,
    });
  }

  private normalizeSettings(settings: KnowledgeBaseSettings): KnowledgeBaseSettings {
    let normalizedSettings = settings;

    if (normalizedSettings.summarization.maxTokens) {
      normalizedSettings = {
        ...normalizedSettings,
        summarization: {
          ...normalizedSettings.summarization,
          // maxTokens can't be higher than the model limit
          maxTokens: Math.min(
            normalizedSettings.summarization.maxTokens,
            AI_MODEL_PARAMS[normalizedSettings.summarization.model].maxTokens
          ),
        },
      };
    }

    return normalizedSettings;
  }

  private async findCacheForAssistant(assistantID: string): Promise<KnowledgeBaseSettings | undefined> {
    const cachedSettings = await this.settingsCache.get({ assistantID });

    if (cachedSettings) {
      return JSON.parse(cachedSettings);
    }

    return undefined;
  }

  private async updateCacheForAssistant(assistantID: string, settings: KnowledgeBaseSettings) {
    await this.settingsCache.set({ assistantID }, JSON.stringify(settings));
  }

  private async findCacheForEnvironment(environmentID: string): Promise<KnowledgeBaseSettings | undefined> {
    const cachedSettings = await this.environmentSettingsCache.get({ environmentID });

    if (cachedSettings) {
      return JSON.parse(cachedSettings);
    }

    return undefined;
  }

  private async updateCacheForEnvironment(environmentID: string, settings: KnowledgeBaseSettings) {
    await this.environmentSettingsCache.set({ environmentID }, JSON.stringify(settings));
  }

  private async findForAssistantOnly(assistantID: string): Promise<KnowledgeBaseSettings> {
    let settings = await this.orm.findSettings(assistantID);

    if (settings) {
      await this.updateCacheForAssistant(assistantID, settings);
    } else {
      await this.updateForAssistant(assistantID, KB_SETTINGS_DEFAULT);

      settings = KB_SETTINGS_DEFAULT;
    }

    return settings;
  }

  async findForAssistant(assistantID: string): Promise<KnowledgeBaseSettings> {
    const { devVersion, workspaceID } = await this.projectORM.getVersionAndWorkspaceID(assistantID);

    if (devVersion && this.unleash.isEnabled(FeatureFlag.VERSIONED_KB_SETTINGS, { workspaceID })) {
      return this.findForEnvironment(devVersion);
    }

    const cachedSettings = await this.findCacheForAssistant(assistantID);

    if (cachedSettings) {
      return cachedSettings;
    }

    return this.findForAssistantOnly(assistantID);
  }

  async updateForAssistant(assistantID: string, settings: KnowledgeBaseSettings): Promise<void> {
    const normalizedSettings = this.normalizeSettings(settings);

    await this.orm.updateSettings(assistantID, normalizedSettings);
    await this.updateCacheForAssistant(assistantID, normalizedSettings);
  }

  async findForEnvironment(environmentID: string): Promise<KnowledgeBaseSettings> {
    const cachedSettings = await this.findCacheForEnvironment(environmentID);

    if (cachedSettings) {
      return cachedSettings;
    }

    const { projectID, knowledgeBase } = await this.versionORM.findOneOrFail(environmentID, {
      fields: ['projectID', 'knowledgeBase'],
    });

    if (knowledgeBase?.settings) {
      await this.updateCacheForEnvironment(environmentID, knowledgeBase.settings);

      return knowledgeBase.settings;
    }

    const projectSettings = await this.orm.findSettings(projectID.toJSON());

    if (projectSettings) {
      // copy data from project level to version level if version level is empty
      await this.updateForEnvironment(environmentID, projectSettings);

      return projectSettings;
    }

    // apply default settings if none are available
    await this.updateForEnvironment(environmentID, KB_SETTINGS_DEFAULT);

    return KB_SETTINGS_DEFAULT;
  }

  async updateForEnvironment(environmentID: string, settings: KnowledgeBaseSettings) {
    const normalizedSettings = this.normalizeSettings(settings);

    await this.versionORM.updateKnowledgeBaseSettings(environmentID, normalizedSettings);

    await this.updateCacheForEnvironment(environmentID, normalizedSettings);
  }
}

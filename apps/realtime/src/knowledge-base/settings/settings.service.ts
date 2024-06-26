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

  private normalizeSettings<T extends Partial<KnowledgeBaseSettings>>(settings: T): T {
    let normalizedSettings: T = settings;

    if (normalizedSettings.summarization) {
      let { summarization } = normalizedSettings;

      if (summarization.maxTokens) {
        summarization = {
          ...summarization,
          // maxTokens can't be higher than the model limit
          maxTokens: Math.min(summarization.maxTokens, AI_MODEL_PARAMS[summarization.model].maxTokens),
        };
      }

      const modelConfig = AI_MODEL_PARAMS[summarization.model];

      if (modelConfig.deprecated) {
        summarization = {
          ...summarization,
          model: KB_SETTINGS_DEFAULT.summarization.model,
        };
      }

      normalizedSettings = { ...normalizedSettings, summarization };
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

    return settings;
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

    return settings;
  }

  async findForAssistant(assistantID: string): Promise<KnowledgeBaseSettings> {
    const { devVersion, workspaceID } = await this.projectORM.getVersionAndWorkspaceID(assistantID);

    if (devVersion && this.unleash.isEnabled(FeatureFlag.VERSIONED_KB_SETTINGS, { workspaceID })) {
      return this.findForEnvironment(devVersion);
    }

    let settings = await this.findCacheForAssistant(assistantID);
    let normalizedSettings = settings ? this.normalizeSettings(settings) : settings;

    // return cached settings if they are already normalized
    if (settings && normalizedSettings === settings) {
      return normalizedSettings;
    }

    settings = await this.orm.findSettings(assistantID);

    if (settings) {
      normalizedSettings = this.normalizeSettings(settings);

      // update cache if settings are normalized
      if (settings === normalizedSettings) {
        return this.updateCacheForAssistant(assistantID, normalizedSettings);
      }

      // update assistant level settings with normalized settings
      return this.updateForAssistant(assistantID, normalizedSettings);
    }

    // apply default settings if none are available
    return this.updateForAssistant(assistantID, KB_SETTINGS_DEFAULT);
  }

  async updateForAssistant(assistantID: string, patch: Partial<KnowledgeBaseSettings>) {
    const { devVersion, workspaceID } = await this.projectORM.getVersionAndWorkspaceID(assistantID);

    if (devVersion && this.unleash.isEnabled(FeatureFlag.VERSIONED_KB_SETTINGS, { workspaceID })) {
      return this.updateForEnvironment(devVersion, patch);
    }

    const settings = await this.orm.updateSettings(assistantID, this.normalizeSettings(patch));

    return this.updateCacheForAssistant(assistantID, settings);
  }

  async findForEnvironment(environmentID: string): Promise<KnowledgeBaseSettings> {
    const settings = await this.findCacheForEnvironment(environmentID);

    let normalizedSettings = settings ? this.normalizeSettings(settings) : settings;

    // return cached settings if they are already normalized
    if (settings && normalizedSettings === settings) {
      return normalizedSettings;
    }

    const { projectID, knowledgeBase } = await this.versionORM.findOneOrFail(environmentID, {
      fields: ['projectID', 'knowledgeBase'],
    });

    if (knowledgeBase?.settings) {
      normalizedSettings = this.normalizeSettings(knowledgeBase.settings);

      // update cache if settings are normalized
      if (knowledgeBase.settings === normalizedSettings) {
        return this.updateCacheForEnvironment(environmentID, normalizedSettings);
      }

      // update version level settings with normalized settings
      return this.updateForEnvironment(environmentID, normalizedSettings);
    }

    const projectSettings = await this.orm.findSettings(projectID.toJSON());

    if (projectSettings) {
      // copy data from project level to version level if version level is empty
      return this.updateForEnvironment(environmentID, projectSettings);
    }

    // apply default settings if none are available
    return this.updateForEnvironment(environmentID, KB_SETTINGS_DEFAULT);
  }

  async updateForEnvironment(environmentID: string, patch: Partial<KnowledgeBaseSettings>) {
    const settings = await this.versionORM.updateKnowledgeBaseSettings(environmentID, this.normalizeSettings(patch));

    return this.updateCacheForEnvironment(environmentID, settings);
  }
}

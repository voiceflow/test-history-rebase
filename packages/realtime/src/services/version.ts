import { BaseModels } from '@voiceflow/base-types';
import { AnyRecord, Nullish } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import type { DiagramUpdateData, VersionUpdateData } from '@/clients/voiceflow/version';

import { AbstractControl } from '../control';
import AccessCache from './utils/accessCache';

class VersionService extends AbstractControl {
  public access = new AccessCache('version', this.clients, this.services);

  public async get<P extends BaseModels.Version.PlatformData>(creatorID: number, versionID: string): Promise<BaseModels.Version.Model<P>> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.version.get(versionID);
  }

  async getPlatform(creatorID: number, versionID: string): Promise<VoiceflowConstants.PlatformType> {
    const version = await this.get(creatorID, versionID);

    return this.services.project.getPlatform(creatorID, version.projectID);
  }

  public async patch(
    creatorID: number,
    versionID: string,
    data: Partial<BaseModels.Version.Model<BaseModels.Version.PlatformData<AnyRecord, AnyRecord>>>
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.version.update(versionID, data);
  }

  public async replaceResources(creatorID: number, versionID: string, version: VersionUpdateData, diagrams: DiagramUpdateData[]): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.version.replaceResources(versionID, version, diagrams);
  }

  public async updateVariables(creatorID: number, versionID: string, variables: string[]): Promise<void> {
    await this.patch(creatorID, versionID, { variables });
  }

  public async patchSettings<T extends Realtime.AnyVersionSettings>(
    creatorID: number,
    versionID: string,
    platform: Nullish<VoiceflowConstants.PlatformType>,
    settings: Partial<T>
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const _platform = platform ?? (await this.getPlatform(creatorID, versionID));

    await client.version.platform(_platform).patchSettings(versionID, settings);
  }

  public async patchSession(
    creatorID: number,
    versionID: string,
    platform: Nullish<VoiceflowConstants.PlatformType>,
    session: Partial<Realtime.Version.Session>
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const _platform = platform ?? (await this.getPlatform(creatorID, versionID));

    const {
      platformData: {
        settings: { session: dbSession, defaultVoice },
      },
    } = await this.get<Realtime.AnyVoiceVersionPlatformData>(creatorID, versionID);

    const platformSessionAdapter = Realtime.Adapters.createSessionAdapter({ platform: _platform });
    const patchedSession = platformSessionAdapter.toDB(
      {
        ...platformSessionAdapter.fromDB(dbSession, { defaultVoice }),
        ...session,
      } as Realtime.Version.Session,
      { defaultVoice }
    );

    await client.version.platform(_platform).patchSettings(versionID, { session: patchedSession } as Partial<Realtime.AnyVersionSettings>);
  }

  public async patchPublishing(
    creatorID: number,
    versionID: string,
    platform: Nullish<VoiceflowConstants.PlatformType>,
    publishing: Partial<Realtime.AnyVersionPublishing>
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const _platform = platform ?? (await this.getPlatform(creatorID, versionID));

    await client.version.platform(_platform).patchPublishing(versionID, publishing);
  }

  public async patchPlatformData<T extends BaseModels.Version.PlatformData>(
    creatorID: number,
    versionID: string,
    platformData: Partial<T>
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.version.updatePlatformData(versionID, platformData);
  }

  public async patchDefaultStepColors(creatorID: number, versionID: string, defaultStepColors: Realtime.Version.DefaultStepColors): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.version.updateDefaultStepColors(versionID, defaultStepColors);
  }

  public async reorderTopics(creatorID: number, versionID: string, fromID: string, toIndex: number): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.version.reorderTopics(versionID, { fromID, toIndex });
  }

  public async reorderComponents(creatorID: number, versionID: string, fromID: string, toIndex: number): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.version.reorderComponents(versionID, { fromID, toIndex });
  }
}

export default VersionService;

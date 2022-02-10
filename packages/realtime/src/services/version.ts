import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { AbstractControl } from '../control';

class VersionService extends AbstractControl {
  private static getCanReadKey({ versionID, creatorID }: { versionID: string; creatorID: number }): string {
    return `versions:${versionID}:can-read:${creatorID}`;
  }

  private canReadCache = this.clients.cache.createKeyValue({
    adapter: this.clients.cache.adapters.booleanAdapter,
    keyCreator: VersionService.getCanReadKey,
  });

  public async canRead(creatorID: number, versionID: string): Promise<boolean> {
    const cachedCanRead = await this.canReadCache.get({ versionID, creatorID });

    if (cachedCanRead !== null) {
      return cachedCanRead;
    }

    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const canRead = await client.version.canRead(creatorID, versionID);

    await this.canReadCache.set({ versionID, creatorID }, canRead);

    return canRead;
  }

  public async get<P extends BaseModels.Version.PlatformData>(creatorID: number, versionID: string): Promise<BaseModels.Version.Model<P>> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    return client.version.get(versionID);
  }

  public async getPlatform(creatorID: number, versionID: string): Promise<VoiceflowConstants.PlatformType> {
    const version = await this.get(creatorID, versionID);

    return this.services.project.getPlatform(creatorID, version.projectID);
  }

  public async patch(creatorID: number, versionID: string, data: Partial<Realtime.AnyVersion>): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.version.update(versionID, data);
  }

  public async updateVariables(creatorID: number, versionID: string, variables: string[]): Promise<void> {
    await this.patch(creatorID, versionID, { variables });
  }

  public async patchSettings<T extends Realtime.AnyVersionSettings>(creatorID: number, versionID: string, settings: Partial<T>): Promise<void> {
    const [client, platform] = await Promise.all([this.services.voiceflow.getClientByUserID(creatorID), this.getPlatform(creatorID, versionID)]);

    await client.version.platform(platform).patchSettings(versionID, settings);
  }

  public async patchSession(creatorID: number, versionID: string, session: Partial<Realtime.Version.Session>): Promise<void> {
    const [client, platform] = await Promise.all([this.services.voiceflow.getClientByUserID(creatorID), this.getPlatform(creatorID, versionID)]);

    const {
      platformData: {
        settings: { session: dbSession, defaultVoice },
      },
    } = await this.get<Realtime.AnyVoiceVersionPlatformData>(creatorID, versionID);

    const platformSessionAdapter = Realtime.Adapters.createSessionAdapter({ platform });
    const patchedSession = platformSessionAdapter.toDB(
      {
        ...platformSessionAdapter.fromDB(dbSession, { defaultVoice }),
        ...session,
      } as Realtime.Version.Session,
      { defaultVoice }
    );

    await client.version.platform(platform).patchSettings(versionID, { session: patchedSession } as Partial<Realtime.AnyVersionSettings>);
  }

  public async patchPublishing(creatorID: number, versionID: string, publishing: Partial<Realtime.AnyVersionPublishing>): Promise<void> {
    const [client, platform] = await Promise.all([this.services.voiceflow.getClientByUserID(creatorID), this.getPlatform(creatorID, versionID)]);

    await client.version.platform(platform).patchPublishing(versionID, publishing);
  }

  public async patchPlatformData<T extends BaseModels.Version.PlatformData>(
    creatorID: number,
    versionID: string,
    platformData: Partial<T>
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.version.updatePlatformData(versionID, platformData);
  }

  public async getIntentSteps(creatorID: number, versionID: string): Promise<Record<string, Record<string, string | null>>> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const { diagrams: dbDiagrams } = await client.version.export(versionID);

    const intentSteps: Record<string, Record<string, string | null>> = {};

    Object.keys(dbDiagrams).forEach((diagramID) => {
      const dbDiagram = dbDiagrams[diagramID];

      const diagramIntentSteps: Record<string, string | null> = {};
      intentSteps[diagramID] = diagramIntentSteps;

      Object.values(dbDiagram.nodes).forEach((node) => {
        if (node.type !== Realtime.BlockType.INTENT) return;

        diagramIntentSteps[node.nodeID] = node.data.intent ?? null;
      }, []);
    });

    return intentSteps;
  }

  public async reorderTopics(creatorID: number, versionID: string, from: number, to: number): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const { topics } = await client.version.get<{ topics?: BaseModels.Version.FolderItem[] }>(versionID, ['topics']);

    if (!topics?.length) {
      throw new Error('Topics are empty');
    }

    await client.version.update(versionID, { topics: Utils.array.reorder(topics, from, to) });
  }

  public async reorderComponents(creatorID: number, versionID: string, from: number, to: number): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const { components } = await client.version.get<{ components?: BaseModels.Version.FolderItem[] }>(versionID, ['components']);

    if (!components?.length) {
      throw new Error('Components are empty');
    }

    await client.version.update(versionID, { components: Utils.array.reorder(components, from, to) });
  }
}

export default VersionService;

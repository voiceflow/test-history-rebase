import { AnyRecord, BaseModels, BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import type { DiagramUpdateData, VersionUpdateData } from '@/clients/voiceflow/version';

import { AbstractControl } from '../control';

type StartingBlockMap = Record<string, Realtime.diagram.DiagramStartingBlockMap>;
type IntentStepsMap = Record<string, Realtime.diagram.DiagramIntentStepMap>;

class VersionService extends AbstractControl {
  private static getCanReadKey({ versionID, creatorID }: { versionID: string; creatorID: number }): string {
    return `versions:${versionID}:can-read:${creatorID}`;
  }

  private canReadCache = this.clients.cache.createKeyValue({
    expire: 60,
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

  private intentStepsNodeMapper = (node: BaseModels.BaseDiagramNode<AnyRecord>): Realtime.diagram.DiagramIntentStep | null => {
    if (!Realtime.Utils.typeGuards.isIntentDBNode(node) || !node.data.intent) return null;
    return { intentID: node.data.intent, global: !node.data.availability || node.data.availability === BaseNode.Intent.IntentAvailability.GLOBAL };
  };

  private startingBlockNodeMapper = (node: BaseModels.BaseDiagramNode<AnyRecord>): Realtime.diagram.DiagramStartingBlock | null => {
    if (node.type !== BaseModels.BaseNodeType.BLOCK && node.type !== Realtime.BlockType.START) return null;
    return { blockID: node.nodeID, name: node.data.name };
  };

  public async getResourcesFromDiagrams(
    creatorID: number,
    versionID: string
  ): Promise<{ startingBlocks: StartingBlockMap; intentSteps: IntentStepsMap }> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const { diagrams: dbDiagrams } = await client.version.export(versionID);

    const startingBlocks: StartingBlockMap = {};
    const intentSteps: IntentStepsMap = {};

    Object.keys(dbDiagrams).forEach((diagramID) => {
      const dbDiagram = dbDiagrams[diagramID];

      const diagramStartingBlocks: Realtime.diagram.DiagramStartingBlockMap = {};
      const diagramIntentSteps: Realtime.diagram.DiagramIntentStepMap = {};
      startingBlocks[diagramID] = diagramStartingBlocks;
      intentSteps[diagramID] = diagramIntentSteps;

      Object.values(dbDiagram.nodes).forEach((node) => {
        const startingBlockNode = this.startingBlockNodeMapper(node);
        const intentStepsNode = this.intentStepsNodeMapper(node);

        if (startingBlockNode) diagramStartingBlocks[node.nodeID] = startingBlockNode;
        if (intentStepsNode) diagramIntentSteps[node.nodeID] = intentStepsNode;
      });
    });

    return { startingBlocks, intentSteps };
  }

  public async reorderTopics(creatorID: number, versionID: string, fromID: string, toIndex: number): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    await client.version.reorderTopics(versionID, { fromID, toIndex });
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

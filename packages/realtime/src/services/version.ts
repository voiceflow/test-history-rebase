import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { Optional } from 'utility-types';

import { AbstractControl } from '../control';
import type { DiagramPatchData } from './diagram';
import AccessCache from './utils/accessCache';

export type VersionPatchData = Partial<
  Omit<BaseModels.Version.Model<BaseModels.Version.PlatformData>, VersionService['models']['version']['READ_ONLY_KEYS'][number]>
>;

class VersionService extends AbstractControl {
  public access = new AccessCache('version', this.clients, this.services);

  public async get<PlatformData extends BaseModels.Version.PlatformData>(versionID: string): Promise<BaseModels.Version.Model<PlatformData>> {
    return this.models.version.findByID(versionID).then(this.models.version.adapter.fromDB) as Promise<BaseModels.Version.Model<PlatformData>>;
  }

  public async getIntents<PlatformData extends BaseModels.Version.PlatformData>(versionID: string): Promise<PlatformData['intents']> {
    const { platformData } = await this.models.version.findByID(versionID, ['platformData']).then(this.models.version.adapter.fromDB);

    return platformData.intents;
  }

  public async getComponents(creatorID: number, versionID: string): Promise<BaseModels.Version.FolderItem[]> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const fields = ['components'] as const;
    const { components } = await client.version.get<Pick<BaseModels.Version.Model<BaseModels.Version.PlatformData>, typeof fields[number]>>(
      versionID,
      ['components']
    );

    return components ?? [];
  }

  public async getSlots<PlatformData extends BaseModels.Version.PlatformData>(versionID: string): Promise<PlatformData['slots']> {
    const { platformData } = await this.models.version.findByID(versionID, ['platformData']).then(this.models.version.adapter.fromDB);

    return platformData.slots;
  }

  async create({ manualSave = false, autoSaveFromRestore = false, ...version }: Optional<BaseModels.Version.Model<any>>) {
    return this.models.version
      .insertOne(this.models.version.adapter.toDB({ ...version, manualSave, autoSaveFromRestore }))
      .then(this.models.version.adapter.fromDB);
  }

  async patch(versionID: string, data: VersionPatchData): Promise<void> {
    await this.models.version.updateByID(versionID, this.models.version.adapter.toDB(data));
  }

  async delete(versionID: string): Promise<void> {
    await this.models.version.deleteByID(versionID);
  }

  public async snapshot<PlatformData extends BaseModels.Version.PlatformData>(
    creatorID: number,
    versionID: string,
    options: { manualSave?: boolean; name?: string; autoSaveFromRestore?: boolean } = {}
  ): Promise<{ version: BaseModels.Version.Model<PlatformData>; diagrams: BaseModels.Diagram.Model[] }> {
    const oldVersion = await this.models.version.findByID(versionID).then(this.models.version.adapter.fromDB);

    const oldDiagramIDs = await this.models.diagram
      .findManyByVersionID(versionID, ['_id'])
      .then((diagrams) => diagrams.map((diagram) => this.models.diagram.adapter.fromDB(diagram)._id));

    const newVersionID = this.models.version.generateObjectIDString();

    const diagrams = await this.services.diagram.cloneMany(creatorID, newVersionID, oldDiagramIDs);

    const diagramIDMap = new Map(oldDiagramIDs.map((id, index) => [id, diagrams[index]._id]));

    const version = await this.create({
      ...Utils.id.remapObjectIDs(
        {
          ...oldVersion,
          _id: newVersionID,
          creatorID,
          manualSave: !!options.manualSave,
          autoSaveFromRestore: !!options.autoSaveFromRestore,
          ...(options.name ? { name: options.name } : {}),
        },
        diagramIDMap
      ),
    });

    return {
      version: version as BaseModels.Version.Model<PlatformData>,
      diagrams,
    };
  }

  public async replaceResources(
    versionID: string,
    version: VersionPatchData,
    diagrams: [diagramID: string, diagramPatch: DiagramPatchData][]
  ): Promise<void> {
    await Promise.all(diagrams.map(([diagramID, diagramPatch]) => this.services.diagram.patch(diagramID, diagramPatch)));

    await this.patch(versionID, version);
  }

  public async updateVariables(versionID: string, variables: string[]): Promise<void> {
    await this.patch(versionID, { variables });
  }

  public async patchPlatformData<T extends BaseModels.Version.PlatformData>(versionID: string, platformData: Partial<T>): Promise<void> {
    await this.models.version.updatePlatformData(versionID, platformData);
  }

  public async patchDefaultStepColors(versionID: string, defaultStepColors: Realtime.Version.DefaultStepColors): Promise<void> {
    await this.models.version.updateDefaultStepColors(versionID, defaultStepColors);
  }

  public async addComponent(versionID: string, item: BaseModels.Version.FolderItem, index?: number): Promise<void> {
    await this.models.version.component.add({ item, index, versionID });
  }

  public async removeComponent(versionID: string, componentID: string): Promise<void> {
    await this.models.version.component.remove({ versionID, componentID });
  }

  public async reorderComponents(versionID: string, sourceID: string, index: number): Promise<void> {
    await this.models.version.component.reorder({ index, sourceID, versionID });
  }

  public async patchPlatformSettings<T extends Realtime.AnyVersionSettings>(
    creatorID: number,
    versionID: string,
    platform: VoiceflowConstants.PlatformType,
    settings: Partial<T>
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.version.platform(platform).patchSettings(versionID, settings);
  }

  public async patchPlatformSession(
    creatorID: number,
    versionID: string,
    platform: VoiceflowConstants.PlatformType,
    session: Partial<Realtime.Version.Session>
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    const {
      platformData: {
        settings: { session: dbSession, defaultVoice },
      },
    } = await this.get<Realtime.AnyVoiceVersionPlatformData>(versionID);

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

  public async patchPlatformPublishing(
    creatorID: number,
    versionID: string,
    platform: VoiceflowConstants.PlatformType,
    publishing: Partial<Realtime.AnyVersionPublishing>
  ): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);

    await client.version.platform(platform).patchPublishing(versionID, publishing);
  }
}

export default VersionService;

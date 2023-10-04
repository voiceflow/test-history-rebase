import { BaseModels, BaseVersion } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config/backend';
import { Optional } from 'utility-types';

import { AbstractControl } from '../control';
import type { DiagramPatchData } from './diagram';
import AccessCache from './utils/accessCache';

export type VersionPatchData = Partial<Omit<BaseVersion.Version, VersionService['models']['version']['READ_ONLY_KEYS'][number]>>;

class VersionService extends AbstractControl {
  public access = new AccessCache('version', this.clients, this.services);

  public async get(versionID: string): Promise<BaseVersion.Version> {
    return this.models.version.findByID(versionID).then(this.models.version.adapter.fromDB);
  }

  public async getComponentNames(versionID: string): Promise<string[]> {
    const { components } = await this.models.version.findByID(versionID, ['components']);

    const componentIDs =
      components?.filter(({ type }) => type === BaseModels.Version.FolderItemType.DIAGRAM).map((component) => component.sourceID) ?? [];

    return this.services.diagram.getNamesByIDs(versionID, componentIDs);
  }

  async create({ manualSave = false, autoSaveFromRestore = false, ...version }: Optional<BaseVersion.Version>) {
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

  public async snapshot(
    creatorID: number,
    versionID: string,
    options: { manualSave?: boolean; name?: string; autoSaveFromRestore?: boolean } = {}
  ): Promise<{ version: BaseVersion.Version; diagrams: BaseModels.Diagram.Model[] }> {
    const oldVersion = await this.models.version.findByID(versionID).then(this.models.version.adapter.fromDB);

    const oldDiagramIDs = await this.models.diagram
      .findManyByVersionID(versionID, ['_id'])
      .then((diagrams) => diagrams.map((diagram) => this.models.diagram.adapter.fromDB(diagram)._id));

    const newVersionID = this.models.version.generateObjectIDString();

    const { diagrams, diagramIDRemap } = await this.services.diagram.cloneMany(creatorID, newVersionID, oldDiagramIDs);

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
        diagramIDRemap
      ),
    });

    return {
      version,
      diagrams,
    };
  }

  public async replaceResources(
    versionID: string,
    version: VersionPatchData,
    diagrams: [diagramID: string, diagramPatch: DiagramPatchData][]
  ): Promise<void> {
    await Promise.all(diagrams.map(([diagramID, diagramPatch]) => this.services.diagram.patch(versionID, diagramID, diagramPatch)));

    await this.patch(versionID, version);
  }

  public async updateVariables(versionID: string, variables: string[]): Promise<void> {
    await this.patch(versionID, { variables });
  }

  public async patchPlatformData(versionID: string, platformData: Partial<BaseVersion.PlatformData>): Promise<void> {
    await this.models.version.updatePlatformData(versionID, platformData);
  }

  public async patchDefaultStepColors(versionID: string, defaultStepColors: BaseModels.Version.DefaultStepColors): Promise<void> {
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

  public async patchPlatformSettings({
    type,
    platform,
    settings,
    creatorID,
    versionID,
    defaultVoice,
  }: {
    type: Platform.Constants.ProjectType;
    platform: Platform.Constants.PlatformType;
    settings: Partial<Platform.Base.Models.Version.Settings.Model>;
    creatorID: number;
    versionID: string;
    defaultVoice: string;
  }): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const projectConfig = Platform.Config.getTypeConfig({ type, platform });
    const dbSettings = projectConfig.adapters.version.settings.smart.toDB(settings, { defaultVoice });

    if (!Object.keys(dbSettings).length) return;

    await client.version.updatePlatformDataSettings(versionID, dbSettings);
  }

  public async patchPlatformSession({
    type,
    session,
    platform,
    creatorID,
    versionID,
    defaultVoice,
  }: {
    type: Platform.Constants.ProjectType;
    session: Partial<Platform.Base.Models.Version.Session>;
    platform: Platform.Constants.PlatformType;
    creatorID: number;
    versionID: string;
    defaultVoice: string;
  }): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const projectConfig = Platform.Config.getTypeConfig({ type, platform });

    const { platformData } = await this.get(versionID);

    const dbSession = projectConfig.adapters.version.session.simple.toDB(
      { ...projectConfig.adapters.version.session.simple.fromDB(platformData.settings.session, { defaultVoice }), ...session },
      { defaultVoice }
    );

    if (!dbSession || !Object.keys(dbSession).length) return;

    await client.version.updatePlatformDataSettings(versionID, { session: dbSession });
  }

  public async patchPlatformPublishing({
    type,
    platform,
    creatorID,
    versionID,
    publishing,
    defaultVoice,
  }: {
    type: Platform.Constants.ProjectType;
    platform: Platform.Constants.PlatformType;
    creatorID: number;
    versionID: string;
    publishing: Partial<Platform.Base.Models.Version.Publishing.Model>;
    defaultVoice: string;
  }): Promise<void> {
    const client = await this.services.voiceflow.getClientByUserID(creatorID);
    const projectConfig = Platform.Config.getTypeConfig({ type, platform });
    const dbPublishing = projectConfig.adapters.version.publishing.smart.toDB(publishing, { defaultVoice });

    if (!Object.keys(dbPublishing).length) return;

    await client.version.platform(platform).patchPublishing(versionID, dbPublishing);
  }
}

export default VersionService;

import { Inject, Injectable } from '@nestjs/common';
import { BaseModels, BaseVersion } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Optional } from 'utility-types';

import { DiagramService } from '@/diagram/diagram.service';

import { VersionORM } from '../orm/version.orm';

@Injectable()
export class VersionService {
  constructor(@Inject(DiagramService) private readonly diagramService: DiagramService, @Inject(VersionORM) private readonly orm: VersionORM) {}

  async create({ manualSave = false, autoSaveFromRestore = false, ...version }: Optional<BaseVersion.Version>) {
    return this.orm.insertOne({ ...version, manualSave, autoSaveFromRestore });
  }

  public async snapshot(
    creatorID: number,
    versionID: string,
    options: { manualSave?: boolean; name?: string; autoSaveFromRestore?: boolean } = {}
  ): Promise<{ version: BaseVersion.Version; diagrams: BaseModels.Diagram.Model[] }> {
    const oldVersion = await this.orm.findByID(versionID);

    const oldDiagramIDs = await this.diagramService.findManyByVersionID(versionID);

    const newVersionID = this.orm.generateObjectIDString();

    const { diagrams, diagramIDRemap } = await this.diagramService.cloneMany(creatorID, newVersionID, oldDiagramIDs);

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

  public async patchPlatformData(versionID: string, platformData: Partial<BaseVersion.PlatformData>): Promise<void> {
    await this.orm.updatePlatformData(versionID, platformData);
  }

  public async get(versionID: string): Promise<BaseVersion.Version> {
    // eslint-disable-next-line no-console
    console.log('GET VERSION', this.orm);
    return this.orm.findByID(versionID);
  }

  async patch(versionID: string, data: Partial<BaseVersion.Version>): Promise<void> {
    await this.orm.updateByID(versionID, data);
  }

  public async replaceResources(
    versionID: string,
    version: BaseVersion.Version,
    diagrams: [diagramID: string, diagramPatch: BaseModels.Diagram.Model][]
  ): Promise<void> {
    await Promise.all(diagrams.map(([diagramID, diagramPatch]) => this.diagramService.patch(diagramID, diagramPatch)));

    await this.patch(versionID, version);
  }
}

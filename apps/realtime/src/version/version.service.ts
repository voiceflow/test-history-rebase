import { Injectable } from '@nestjs/common';
import { BaseModels, BaseVersion } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Optional } from 'utility-types';

import { DiagramService } from '@/diagram/diagram.service';

import { VersionORM } from './version.orm';

export const MIGRATION_IN_PROGRESS_MESSAGE = 'a migration is already in progress';
export const SCHEMA_VERSION_NOT_SUPPORTED_MESSAGE = 'target schema version not supported';
export const INTERNAL_ERROR_MESSAGE = 'migration system experienced an internal error';

@Injectable()
export class VersionService {
  constructor(private diagramService: DiagramService, private orm: VersionORM) {}

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
    return this.orm.findByID(versionID);
  }

  async patch(versionID: string, data: BaseVersion.Version): Promise<void> {
    await this.orm.updateByID(versionID, data);
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { BaseModels, BaseVersion } from '@voiceflow/base-types';
import { Optional } from 'utility-types';

import { DiagramService } from '@/diagram/diagram.service';
import { VersionORM } from '@/orm/version.orm';

@Injectable()
export class VersionService {
  constructor(@Inject(DiagramService) private readonly diagramService: DiagramService, @Inject(VersionORM) private readonly orm: VersionORM) {}

  async create({ manualSave = false, autoSaveFromRestore = false, ...version }: Optional<BaseVersion.Version>) {
    return this.orm.insertOne({ ...version, manualSave, autoSaveFromRestore });
  }

  public async patchPlatformData(versionID: string, platformData: Partial<BaseVersion.PlatformData>): Promise<void> {
    await this.orm.updatePlatformData(versionID, platformData);
  }

  public async get(versionID: string): Promise<BaseVersion.Version> {
    return this.orm.findByID(versionID);
  }

  async patch(versionID: string, data: Partial<BaseVersion.Version>): Promise<void> {
    await this.orm.updateByID(versionID, data);
  }

  public async replaceResources(
    versionID: string,
    version: Partial<BaseVersion.Version>,
    diagrams: [diagramID: string, diagramPatch: Partial<BaseModels.Diagram.Model>][]
  ): Promise<void> {
    await Promise.all(diagrams.map(([diagramID, diagramPatch]) => this.diagramService.patch(diagramID, diagramPatch)));

    await this.patch(versionID, version);
  }
}

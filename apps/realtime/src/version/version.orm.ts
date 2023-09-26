import { Inject, Injectable } from '@nestjs/common';
import { BaseVersion } from '@voiceflow/base-types';
import { ObjectId } from 'bson';
import { Optional } from 'utility-types';

import { LegacyService } from '@/legacy/legacy.service';
import VersionModel from '@/legacy/models/version';

@Injectable()
export class VersionORM {
  private readonly model: VersionModel;

  constructor(@Inject(LegacyService) private readonly legacyService: LegacyService) {
    this.model = this.legacyService.models.version;
  }

  public async findByID(versionID: string) {
    return this.model.findByID(versionID).then(this.model.adapter.fromDB);
  }

  public updatePlatformData(versionID: string, platformData: Partial<BaseVersion.PlatformData>) {
    return this.model.updatePlatformData(versionID, platformData);
  }

  public generateObjectID(): ObjectId {
    return new ObjectId();
  }

  public generateObjectIDString(): string {
    return this.generateObjectID().toHexString();
  }

  async insertOne({ manualSave = false, autoSaveFromRestore = false, ...version }: Optional<BaseVersion.Version>) {
    return this.model.insertOne(this.model.adapter.toDB({ ...version, manualSave, autoSaveFromRestore })).then(this.model.adapter.fromDB);
  }

  public async updateByID(versionID: string, data: BaseVersion.Version) {
    await this.model.updateByID(versionID, this.model.adapter.toDB(data));
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { BaseVersion } from '@voiceflow/base-types';

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

  public generateObjectIDString(): string {
    return '';
  }

  public async updateByID(versionID: string, data: BaseVersion.Version) {
    await this.model.updateByID(versionID, this.model.adapter.toDB(data));
  }
}

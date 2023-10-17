import { Inject, Injectable } from '@nestjs/common';
import { BaseProject } from '@voiceflow/base-types';
import { ObjectId } from 'bson';

import { LegacyService } from '@/legacy/legacy.service';
import ProjectModel from '@/legacy/models/project';

@Injectable()
export class ProjectORM {
  private readonly model: ProjectModel;

  constructor(@Inject(LegacyService) private readonly legacyService: LegacyService) {
    this.model = this.legacyService.models.project;
  }

  public generateObjectID(): ObjectId {
    return new ObjectId();
  }

  public generateObjectIDString(): string {
    return this.generateObjectID().toHexString();
  }

  public async findByID(versionID: string) {
    return this.model.findByID(versionID).then(this.model.adapter.fromDB);
  }

  public async updateByID(versionID: string, data: Partial<BaseProject.Project>) {
    await this.model.updateByID(versionID, this.model.adapter.toDB(data));
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';
import { ObjectId } from 'bson';

import { LegacyService } from '@/legacy/legacy.service';
import ProgramModel from '@/legacy/models/program';

@Injectable()
export class ProgramORM {
  private readonly model: ProgramModel;

  constructor(@Inject(LegacyService) private readonly legacyService: LegacyService) {
    this.model = this.legacyService.models.program;
  }

  public generateObjectID(): ObjectId {
    return new ObjectId();
  }

  public generateObjectIDString(): string {
    return this.generateObjectID().toHexString();
  }

  public async findByID(programID: string) {
    return this.model.findByID(programID).then(this.model.adapter.fromDB);
  }

  public async create(data: Omit<BaseModels.Program.Model, '_id'>) {
    return this.model.insertOne(this.model.adapter.toDB(data));
  }

  public deleteOne(programID: string) {
    return this.model.deleteByID(programID);
  }

  public async updateByID(programID: string, data: Partial<BaseModels.Program.Model>) {
    await this.model.updateByID(programID, this.model.adapter.toDB(data)).then(this.model.adapter.fromDB);
  }
}

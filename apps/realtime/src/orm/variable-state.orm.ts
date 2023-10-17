import { Inject, Injectable } from '@nestjs/common';
import { BaseModels } from '@voiceflow/base-types';
import { ObjectId } from 'bson';

import { LegacyService } from '@/legacy/legacy.service';
import VariableStateModel from '@/legacy/models/variable-state';

@Injectable()
export class VariableStateORM {
  private readonly model: VariableStateModel;

  constructor(@Inject(LegacyService) private readonly legacyService: LegacyService) {
    this.model = this.legacyService.models.variableState;
  }

  public generateObjectID(): ObjectId {
    return new ObjectId();
  }

  public generateObjectIDString(): string {
    return this.generateObjectID().toHexString();
  }

  public async findByID(variableStateID: string) {
    return this.model.findByID(variableStateID).then(this.model.adapter.fromDB);
  }

  public async findManyByProjectID(projectID: string) {
    return this.model.findManyByProjectID(projectID).then(this.model.adapter.mapFromDB);
  }

  public async create(data: Omit<BaseModels.VariableState.Model, '_id'>) {
    return this.model.insertOne(this.model.adapter.toDB(data));
  }

  public deleteOne(variableStateID: string) {
    return this.model.deleteByID(variableStateID);
  }

  public async updateByID(variableStateID: string, data: Partial<BaseModels.VariableState.Model>) {
    await this.model
      .updateByID(
        variableStateID,
        this.model.adapter.toDB({
          ...(data.name && { name: data.name }),
          ...(data.startFrom && { startFrom: data.startFrom }),
          ...(data.variables && { variables: data.variables }),
          ...(data.projectID && { projectID: data.projectID }),
        })
      )
      .then(this.model.adapter.fromDB);
  }
}

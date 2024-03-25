import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { ObjectId, VariableStateORM } from '@voiceflow/orm-designer';

import { MutableService } from '@/common';

@Injectable()
export class VariableStateService extends MutableService<VariableStateORM> {
  toJSON = this.orm.jsonAdapter.fromDB;

  fromJSON = this.orm.jsonAdapter.toDB;

  mapToJSON = this.orm.jsonAdapter.mapFromDB;

  mapFromJSON = this.orm.jsonAdapter.mapToDB;

  constructor(
    @Inject(VariableStateORM)
    protected readonly orm: VariableStateORM
  ) {
    super();
  }

  findManyByProject(projectID: string) {
    return this.orm.findManyByProject(projectID);
  }

  async cloneManyByProject({ sourceProjectID, targetProjectID }: { sourceProjectID: string; targetProjectID: string }) {
    const sourceVariableStates = await this.findManyByProject(sourceProjectID);

    if (!sourceVariableStates.length) return [];

    return this.createMany(
      sourceVariableStates.map((variableState) => ({
        ...Utils.object.omit(variableState, ['_id', 'projectID']),
        projectID: new ObjectId(targetProjectID),
      }))
    );
  }
}

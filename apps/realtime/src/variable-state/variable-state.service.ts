import { Inject, Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import { VariableStateORM } from '@voiceflow/orm-designer';

import { EntitySerializer, MutableService } from '@/common';

@Injectable()
export class VariableStateService extends MutableService<VariableStateORM> {
  constructor(
    @Inject(VariableStateORM)
    protected readonly orm: VariableStateORM,
    @Inject(EntitySerializer)
    protected readonly entitySerializer: EntitySerializer
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
        ...Utils.object.omit(this.entitySerializer.serialize(variableState), ['_id', 'projectID']),
        projectID: targetProjectID,
      }))
    );
  }
}

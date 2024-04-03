import type { PatchData } from '@/types';

import { PostgresCMSTabularORM } from '../common';
import { WorkflowEntity } from './workflow.entity';
import { WorkflowJSONAdapter } from './workflow-json.adapter';

export class WorkflowORM extends PostgresCMSTabularORM<WorkflowEntity> {
  Entity = WorkflowEntity;

  jsonAdapter = WorkflowJSONAdapter;

  findManyByDiagramIDs(environmentID: string, diagramIDs: string[]) {
    return this.find({ environmentID, diagramID: diagramIDs });
  }

  async updateOneByDiagramIDAndReturnID(
    environmentID: string,
    diagramID: string,
    patch: PatchData<WorkflowEntity>
  ): Promise<string | null> {
    const qb = this.qb.update<[Pick<WorkflowEntity, 'id'>]>(this.toDB(patch));

    this.buildWhere(qb, { environmentID, diagramID });
    this.buildReturning(qb, ['id']);

    const result = await qb;

    if (result.length === 0) {
      return null;
    }

    return result[0].id;
  }
}

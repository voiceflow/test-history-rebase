import type { PatchData } from '@/types';

import { PostgresCMSTabularORM } from '../common';
import { FlowEntity } from './flow.entity';
import type { FlowObject } from './flow.interface';
import { FlowJSONAdapter } from './flow-json.adapter';

export class FlowORM extends PostgresCMSTabularORM<FlowEntity> {
  Entity = FlowEntity;

  jsonAdapter = FlowJSONAdapter;

  findManyByDiagramIDs(environmentID: string, diagramIDs: string[]) {
    return this.find({ environmentID, diagramID: diagramIDs });
  }

  async updateOneByDiagramIDAndReturnID(
    environmentID: string,
    diagramID: string,
    patch: PatchData<FlowEntity>
  ): Promise<string | null> {
    const qb = this.qb.update<[Pick<FlowObject, 'id'>]>(this.toDB(this.onPatch(patch)));

    this.buildWhere(qb, { environmentID, diagramID });
    this.buildReturning(qb, ['id']);

    const result = await qb;

    if (result.length === 0) {
      return null;
    }

    return result[0].id;
  }
}

import type { MutableEntityData } from '@/types';

import { PostgresCMSTabularORM } from '../common';
import { FlowEntity } from './flow.entity';

export class FlowORM extends PostgresCMSTabularORM(FlowEntity) {
  findManyByDiagramIDs(environmentID: string, diagramIDs: string[]) {
    return this.find({ environmentID, diagramID: diagramIDs });
  }

  async updateOneByDiagramIDAndReturnID(
    environmentID: string,
    diagramID: string,
    patch: MutableEntityData<FlowEntity>
  ): Promise<string | null> {
    const result = await this.em
      .qb(FlowEntity)
      .update(FlowEntity.fromJSON(patch))
      .where({ environmentID, diagramID })
      .returning('id')
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result[0].id;
  }
}

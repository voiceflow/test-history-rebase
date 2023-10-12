import { Entity, Property, Unique } from '@mikro-orm/core';

import type { EntityCreateParams, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { PostgresCMSTabularEntity, SoftDelete } from '../common';

@Entity({ tableName: 'designer.flow' })
@Unique({ properties: ['id', 'environmentID'] })
@SoftDelete()
export class FlowEntity extends PostgresCMSTabularEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<FlowEntity>>(data: Data) {
    return {
      ...super.resolveTabularForeignKeys(data),
    } as ResolvedForeignKeys<FlowEntity, Data>;
  }

  @Property()
  diagramID: string;

  @Property({ default: null })
  description: string | null;

  constructor({ diagramID, description, ...data }: EntityCreateParams<FlowEntity>) {
    super(data);

    ({ diagramID: this.diagramID, description: this.description } = FlowEntity.resolveForeignKeys({
      diagramID,
      description,
    }));
  }
}

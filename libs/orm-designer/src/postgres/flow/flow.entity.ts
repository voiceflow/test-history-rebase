import { Entity, Index, Property, Unique, wrap } from '@mikro-orm/core';

import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { FlowEntityAdapter } from './flow-entity.adapter';

@Entity({ tableName: 'designer.flow' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class FlowEntity extends PostgresCMSTabularEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<FlowEntity>>>(data: JSON) {
    return FlowEntityAdapter.toDB<JSON>(data);
  }

  @Property({ type: 'varchar', length: 24 })
  diagramID: string;

  @Property({ type: 'text', default: null, nullable: true })
  description: string | null;

  constructor({ diagramID, description, ...data }: EntityCreateParams<FlowEntity>) {
    super(data);

    ({ diagramID: this.diagramID, description: this.description } = FlowEntity.fromJSON({
      diagramID,
      description,
    }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<FlowEntity> {
    return FlowEntityAdapter.fromDB({
      ...wrap<FlowEntity>(this).toObject(...args),
      folder: this.folder ?? null,
      updatedBy: this.updatedBy,
      createdBy: this.createdBy,
      assistant: this.assistant,
    });
  }
}

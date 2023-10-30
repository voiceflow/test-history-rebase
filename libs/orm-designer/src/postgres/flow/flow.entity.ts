import { Entity, Property, Unique } from '@mikro-orm/core';

import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { FlowJSONAdapter } from './flow.adapter';

@Entity({ tableName: 'designer.flow' })
@Unique({ properties: ['id', 'environmentID'] })
export class FlowEntity extends PostgresCMSTabularEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<FlowEntity>>>(data: JSON) {
    return FlowJSONAdapter.toDB<JSON>(data);
  }

  @Property()
  diagramID: string;

  @Property({ default: null })
  description: string | null;

  constructor({ diagramID, description, ...data }: EntityCreateParams<FlowEntity>) {
    super(data);

    ({ diagramID: this.diagramID, description: this.description } = FlowEntity.fromJSON({
      diagramID,
      description,
    }));
  }

  toJSON(): ToJSONWithForeignKeys<FlowEntity> {
    return FlowJSONAdapter.fromDB({
      ...this.wrap<FlowEntity>(),
      folder: this.folder,
      assistant: this.assistant,
    });
  }
}

import { Collection, Entity, Index, OneToMany, Property, Unique, wrap } from '@mikro-orm/core';

import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { EventEntityAdapter } from './event-entity.adapter';
import type { EventMappingEntity } from './event-mapping/event-mapping.entity';

@Entity({ tableName: 'designer.event' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class EventEntity extends PostgresCMSTabularEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<EventEntity>>>(data: JSON) {
    return EventEntityAdapter.toDB<JSON>(data);
  }

  @OneToMany('EventMappingEntity', (value: EventMappingEntity) => value.event)
  mappings = new Collection<EventMappingEntity>(this);

  @Property()
  requestName: string;

  @Property({ type: 'text', default: null, nullable: true })
  description: string | null;

  constructor({ requestName, description, ...data }: EntityCreateParams<EventEntity>) {
    super(data);

    this.requestName = requestName;
    this.description = description;

    ({ requestName: this.requestName, description: this.description } = EventEntity.fromJSON({
      requestName,
      description,
    }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<EventEntity> {
    return EventEntityAdapter.fromDB({
      ...wrap<EventEntity>(this).toObject(...args),
      folder: this.folder ?? null,
      updatedBy: this.updatedBy,
      createdBy: this.createdBy,
      assistant: this.assistant,
    });
  }
}

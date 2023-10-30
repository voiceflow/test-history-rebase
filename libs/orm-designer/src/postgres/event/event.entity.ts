import { Collection, Entity, OneToMany, Property, Unique } from '@mikro-orm/core';

import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { EventJSONAdapter } from './event.adapter';
import type { EventMappingEntity } from './event-mapping/event-mapping.entity';

@Entity({ tableName: 'designer.event' })
@Unique({ properties: ['id', 'environmentID'] })
export class EventEntity extends PostgresCMSTabularEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<EventEntity>>>(data: JSON) {
    return EventJSONAdapter.toDB<JSON>(data);
  }

  @OneToMany('EventMappingEntity', (value: EventMappingEntity) => value.event)
  mappings = new Collection<EventMappingEntity>(this);

  @Property()
  requestName: string;

  @Property({ default: null })
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

  toJSON(): ToJSONWithForeignKeys<EventEntity> {
    return EventJSONAdapter.fromDB({
      ...this.wrap<EventEntity>(),
      folder: this.folder,
      assistant: this.assistant,
    });
  }
}

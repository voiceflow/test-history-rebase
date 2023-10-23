import { Collection, Entity, OneToMany, Property, Unique } from '@mikro-orm/core';

import type { EntityCreateParams, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { EventMappingEntity } from './event-mapping/event-mapping.entity';

@Entity({ tableName: 'designer.event' })
@Unique({ properties: ['id', 'environmentID'] })
export class EventEntity extends PostgresCMSTabularEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<EventEntity>>(data: Data) {
    return {
      ...super.resolveTabularForeignKeys(data),
    } as ResolvedForeignKeys<EventEntity, Data>;
  }

  @OneToMany(() => EventMappingEntity, (value) => value.event)
  mappings = new Collection<EventMappingEntity>(this);

  @Property()
  requestName: string;

  @Property({ default: null })
  description: string | null;

  constructor({ requestName, description, ...data }: EntityCreateParams<EventEntity>) {
    super(data);

    this.requestName = requestName;
    this.description = description;

    ({ requestName: this.requestName, description: this.description } = EventEntity.resolveForeignKeys({
      requestName,
      description,
    }));
  }
}

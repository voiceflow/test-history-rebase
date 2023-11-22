import { Injectable } from '@nestjs/common';
import type { BaseEntity } from '@voiceflow/orm-designer';

import type { BaseSerializer } from './base.serializer';

@Injectable()
export class EntitySerializer implements BaseSerializer<BaseEntity, Record<string, any>> {
  serialize<Entity extends BaseEntity>(entity: Entity): ReturnType<Entity['toJSON']> {
    return entity.toJSON() as any;
  }

  nullable<Entity extends BaseEntity>(entity: Entity): ReturnType<Entity['toJSON']>;

  nullable<Entity extends BaseEntity>(entity: Entity | null): ReturnType<Entity['toJSON']> | null;

  nullable<Entity extends BaseEntity>(entity: Entity | null): ReturnType<Entity['toJSON']> | null {
    return !entity ? null : this.serialize(entity);
  }

  iterable = <Entity extends BaseEntity>(entities: Entity[]): ReturnType<Entity['toJSON']>[] => entities.map((value) => this.nullable(value));
}

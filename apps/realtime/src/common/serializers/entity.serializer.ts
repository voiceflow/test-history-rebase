import { Injectable } from '@nestjs/common';
import type { BaseEntity } from '@voiceflow/orm-designer';

import type { BaseSerializer } from './base.serializer';

@Injectable()
export class EntitySerializer implements BaseSerializer<BaseEntity, Record<string, any>> {
  serialize<Entity extends BaseEntity>(entity: Entity): ReturnType<Entity['toJSON']> {
    return entity.toJSON() as any;
  }

  nullable = <Entity extends BaseEntity>(entity: Entity | null): null extends Entity ? null : ReturnType<Entity['toJSON']> => {
    return (!entity ? null : this.serialize(entity)) as null extends Entity ? null : ReturnType<Entity['toJSON']>;
  };

  iterable = <Entity extends BaseEntity>(entities: Entity[]): ReturnType<Entity['toJSON']>[] => entities.map(this.nullable);
}

import type { EntityDTO } from '@mikro-orm/core';
import { Entity, wrap } from '@mikro-orm/core';

// @Entity is needed on this empty class otherwise metadata scanning fails
@Entity({ abstract: true })
export abstract class PostgresAbstractEntity {
  static wrap<Entity extends PostgresAbstractEntity>(entity: Entity) {
    return wrap(entity).toObject();
  }

  wrap<Entity extends PostgresAbstractEntity>(): EntityDTO<Entity> {
    return PostgresAbstractEntity.wrap(this) as unknown as EntityDTO<Entity>;
  }
}

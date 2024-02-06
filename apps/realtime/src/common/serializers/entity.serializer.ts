import { Injectable } from '@nestjs/common';
import { Utils } from '@voiceflow/common';
import type { BaseEntity } from '@voiceflow/orm-designer';

import type { BaseSerializer } from './base.serializer';

@Injectable()
export class EntitySerializer implements BaseSerializer<BaseEntity, Record<string, any>> {
  serialize<Entity extends BaseEntity>(entity: Entity): ReturnType<Entity['toJSON']>;

  serialize<Entity extends BaseEntity, Key extends keyof ReturnType<Entity['toJSON']>>(
    entity: Entity,
    options: { omit: Key[] }
  ): Omit<ReturnType<Entity['toJSON']>, Key>;

  serialize<Entity extends BaseEntity>(entity: Entity, options?: { omit?: Array<keyof ReturnType<Entity['toJSON']>> }) {
    const json = (entity.toJSON?.() ?? entity) as any;

    return options?.omit ? Utils.object.omit(json, options.omit) : json;
  }

  nullable<Entity extends BaseEntity>(entity: Entity): ReturnType<Entity['toJSON']>;

  nullable<Entity extends BaseEntity>(entity: Entity | null): ReturnType<Entity['toJSON']> | null;

  nullable<Entity extends BaseEntity, Key extends keyof ReturnType<Entity['toJSON']>>(
    entity: Entity,
    options: { omit: Key[] }
  ): Omit<ReturnType<Entity['toJSON']>, Key>;

  nullable<Entity extends BaseEntity, Key extends keyof ReturnType<Entity['toJSON']>>(
    entity: Entity | null,
    options: { omit: Key[] }
  ): Omit<ReturnType<Entity['toJSON']>, Key> | null;

  nullable<Entity extends BaseEntity>(entity: Entity | null, options?: { omit?: Array<keyof ReturnType<Entity['toJSON']>> }) {
    if (!entity) {
      return null;
    }

    return this.serialize(entity, options as any);
  }

  iterable<Entity extends BaseEntity>(entity: Entity[]): ReturnType<Entity['toJSON']>[];

  iterable<Entity extends BaseEntity, Key extends keyof ReturnType<Entity['toJSON']>>(
    entities: Entity[],
    options: { omit: Key[] }
  ): Omit<ReturnType<Entity['toJSON']>, Key>[];

  iterable<Entity extends BaseEntity>(entities: Entity[], options?: { omit?: Array<keyof ReturnType<Entity['toJSON']>> }) {
    return entities.map((item) => this.serialize(item, options as any));
  }
}

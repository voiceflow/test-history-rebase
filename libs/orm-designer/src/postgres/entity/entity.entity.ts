import { Collection, Entity as EntityDecorator, OneToMany, Property, wrap } from '@mikro-orm/core';

import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { EntityJSONAdapter } from './entity.adapter';
import type { EntityVariantEntity } from './entity-variant/entity-variant.entity';

@EntityDecorator({ tableName: 'designer.entity' })
export class EntityEntity extends PostgresCMSTabularEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<EntityEntity>>>(data: JSON) {
    return EntityJSONAdapter.toDB<JSON>(data);
  }

  @Property({ type: 'text', default: null })
  description: string | null;

  @Property()
  color: string;

  @Property({ default: null })
  classifier: string | null;

  @Property()
  isArray: boolean;

  @OneToMany('EntityVariantEntity', (value: EntityVariantEntity) => value.entity)
  variants = new Collection<EntityVariantEntity>(this);

  constructor({ color, isArray, classifier, description, ...data }: EntityCreateParams<EntityEntity>) {
    super(data);

    ({
      color: this.color,
      isArray: this.isArray,
      classifier: this.classifier,
      description: this.description,
    } = EntityEntity.fromJSON({ color, isArray, classifier, description }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<EntityEntity> {
    return EntityJSONAdapter.fromDB({
      ...wrap<EntityEntity>(this).toObject(...args),
      folder: this.folder ?? null,
      assistant: this.assistant,
    });
  }
}

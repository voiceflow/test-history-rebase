import { Collection, Entity as EntityDecorator, OneToMany, Property } from '@mikro-orm/core';

import type { EntityCreateParams, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { PostgresCMSTabularEntity, SoftDelete } from '../common';
import { EntityVariantEntity } from './entity-variant/entity-variant.entity';

@EntityDecorator({ tableName: 'designer.entity' })
@SoftDelete()
export class EntityEntity extends PostgresCMSTabularEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<EntityEntity>>(data: Data) {
    return {
      ...super.resolveTabularForeignKeys(data),
    } as ResolvedForeignKeys<EntityEntity, Data>;
  }

  @Property({ default: null })
  description: string | null;

  @Property()
  color: string;

  @Property({ default: null })
  classifier: string | null;

  @Property()
  isArray: boolean;

  @OneToMany(() => EntityVariantEntity, (value) => value.entity)
  variants = new Collection<EntityVariantEntity>(this);

  constructor({ color, isArray, classifier, description, ...data }: EntityCreateParams<EntityEntity>) {
    super(data);

    ({
      color: this.color,
      isArray: this.isArray,
      classifier: this.classifier,
      description: this.description,
    } = EntityEntity.resolveForeignKeys({ color, isArray, classifier, description }));
  }
}

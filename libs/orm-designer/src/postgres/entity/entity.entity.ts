import { Collection, Entity as EntityDecorator, Index, OneToMany, PrimaryKey, Property, wrap } from '@mikro-orm/core';

import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { Environment, PostgresCMSTabularEntity } from '../common';
import { EntityEntityAdapter } from './entity-entity.adapter';
import type { EntityVariantEntity } from './entity-variant/entity-variant.entity';

@EntityDecorator({ tableName: 'designer.entity' })
@Index({ properties: ['environmentID'] })
export class EntityEntity extends PostgresCMSTabularEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<EntityEntity>>>(data: JSON) {
    return EntityEntityAdapter.toDB<JSON>(data);
  }

  // legacy entityIDs could be longer than 24 chars
  @PrimaryKey({ type: 'varchar', nullable: false, length: 64 })
  id!: string;

  // to keep composite key correct, environmentID must be defined after id
  @Environment()
  environmentID!: string;

  @Property({ type: 'text', default: null, nullable: true })
  description: string | null;

  @Property()
  color: string;

  @Property({ default: null, nullable: true })
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
    return EntityEntityAdapter.fromDB({
      ...wrap<EntityEntity>(this).toObject(...args),
      folder: this.folder ?? null,
      updatedBy: this.updatedBy,
      createdBy: this.createdBy,
      assistant: this.assistant,
    });
  }
}

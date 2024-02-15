import {
  ArrayType,
  Entity as EntityDecorator,
  Enum,
  Index,
  ManyToOne,
  PrimaryKeyType,
  Property,
  wrap,
} from '@mikro-orm/core';

import { Language } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { EntityEntity } from '../entity.entity';
import { EntityVariantEntityAdapter } from './entity-variant-entity.adapter';

@EntityDecorator({ tableName: 'designer.entity_variant' })
@Index({ properties: ['environmentID'] })
export class EntityVariantEntity extends PostgresCMSObjectEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<EntityVariantEntity>>>(data: JSON) {
    return EntityVariantEntityAdapter.toDB<JSON>(data);
  }

  @Enum(() => Language)
  language: Language;

  @Property({ type: 'text' })
  value: string;

  @Property({ type: ArrayType })
  synonyms: string[];

  @ManyToOne(() => EntityEntity, {
    name: 'entity_id',
    onDelete: 'cascade',
    fieldNames: ['entity_id', 'environment_id'],
  })
  entity: Ref<EntityEntity>;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<EntityVariantEntity>) {
    super(data);

    ({
      value: this.value,
      entity: this.entity,
      synonyms: this.synonyms,
      language: this.language,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = EntityVariantEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<EntityVariantEntity> {
    return EntityVariantEntityAdapter.fromDB({
      ...wrap<EntityVariantEntity>(this).toObject(...args),
      entity: this.entity,
      updatedBy: this.updatedBy,
      assistant: this.assistant,
    });
  }
}

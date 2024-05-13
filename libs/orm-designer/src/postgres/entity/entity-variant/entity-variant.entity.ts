import { ArrayType, Entity as EntityDecorator, Enum, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import { Language } from '@voiceflow/dtos';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, ObjectIDPrimaryKey, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { EntityEntity } from '../entity.entity';

@EntityDecorator({ tableName: 'designer.entity_variant' })
export class EntityVariantEntity extends PostgresCMSObjectEntity {
  @Environment()
  environmentID!: string;

  @ObjectIDPrimaryKey()
  id!: string;

  @Enum(() => Language)
  language!: Language;

  @Property({ type: 'text' })
  value!: string;

  @Property({ type: ArrayType })
  synonyms!: string[];

  @ManyToOne(() => EntityEntity, {
    name: 'entity_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'entity_id'],
  })
  entity!: Ref<EntityEntity>;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  [PrimaryKeyType]?: CMSCompositePK;
}

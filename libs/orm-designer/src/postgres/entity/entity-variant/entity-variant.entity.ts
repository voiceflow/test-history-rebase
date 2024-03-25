import {
  ArrayType,
  Entity as EntityDecorator,
  Enum,
  Index,
  ManyToOne,
  PrimaryKeyType,
  Property,
} from '@mikro-orm/core';
import { Language } from '@voiceflow/dtos';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { EntityEntity } from '../entity.entity';

@EntityDecorator({ tableName: 'designer.entity_variant' })
@Index({ properties: ['environmentID'] })
export class EntityVariantEntity extends PostgresCMSObjectEntity {
  @Enum(() => Language)
  language!: Language;

  @Property({ type: 'text' })
  value!: string;

  @Property({ type: ArrayType })
  synonyms!: string[];

  @ManyToOne(() => EntityEntity, {
    name: 'entity_id',
    onDelete: 'cascade',
    fieldNames: ['entity_id', 'environment_id'],
  })
  entity!: Ref<EntityEntity>;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Environment()
  environmentID!: string;

  [PrimaryKeyType]?: CMSCompositePK;
}

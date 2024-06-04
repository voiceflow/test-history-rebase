// eslint-disable-next-line max-classes-per-file
import { ArrayType, Entity, Enum, Index, ManyToOne, PrimaryKeyType, Property, Unique } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';
import { CardLayout, ResponseContext, ResponseVariantType } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import { BaseConditionEntity } from '@/postgres/condition';
import type { Prompt } from '@/postgres/prompt';
import type { CMSCompositePK, Ref } from '@/types';

import { ResponseDiscriminatorEntity } from '../response-discriminator/response-discriminator.entity';

const TABLE_NAME = 'designer.response_variant';

@Entity({
  abstract: true,
  tableName: TABLE_NAME,
  discriminatorColumn: 'type',
})
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class BaseResponseVariantEntity<DefaultOrNullColumn extends string = never> extends PostgresCMSObjectEntity<
  DefaultOrNullColumn | 'condition'
> {
  @Enum({
    items: () => ResponseVariantType,
    nullable: true,
    default: ResponseVariantType.TEXT,
  })
  type!: ResponseVariantType | null;

  @ManyToOne(() => BaseConditionEntity, {
    name: 'condition_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
    fieldNames: ['condition_id', 'environment_id'],
  })
  condition!: Ref<BaseConditionEntity> | null;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @ManyToOne(() => ResponseDiscriminatorEntity, {
    name: 'discriminator_id',
    onDelete: 'cascade',
    fieldNames: ['discriminator_id', 'environment_id'],
  })
  discriminator!: Ref<ResponseDiscriminatorEntity>;

  @Environment()
  environmentID!: string;

  @Property({ type: ArrayType })
  attachmentOrder!: string[];

  [PrimaryKeyType]?: CMSCompositePK;
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: ResponseVariantType.PROMPT,
})
export class PromptResponseVariantEntity extends BaseResponseVariantEntity<'prompt'> {
  type!: typeof ResponseVariantType.PROMPT;

  @Property()
  turns!: number;

  @Property({ type: 'jsonb', nullable: true, default: null })
  prompt!: Prompt | null;

  @Enum(() => ResponseContext)
  context!: ResponseContext;
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: ResponseVariantType.TEXT,
})
export class TextResponseVariantEntity extends BaseResponseVariantEntity<'speed'> {
  type!: typeof ResponseVariantType.TEXT;

  @Property({ type: MarkupType })
  text!: Markup;

  @Property({ default: null, nullable: true })
  speed!: number | null;

  @Enum(() => CardLayout)
  cardLayout!: CardLayout;
}

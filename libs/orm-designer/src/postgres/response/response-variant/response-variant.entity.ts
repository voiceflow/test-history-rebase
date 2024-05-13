import { ArrayType, Entity, Enum, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';
import { CardLayout, ResponseContext, ResponseVariantType } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, ObjectIDPrimaryKey, PostgresCMSObjectEntity } from '@/postgres/common';
import { BaseConditionEntity } from '@/postgres/condition';
import { PromptEntity } from '@/postgres/prompt';
import type { CMSCompositePK, Ref } from '@/types';

import { ResponseDiscriminatorEntity } from '../response-discriminator/response-discriminator.entity';

const TABLE_NAME = 'designer.response_variant';

@Entity({
  abstract: true,
  tableName: TABLE_NAME,
  discriminatorColumn: 'type',
})
export class BaseResponseVariantEntity<DefaultOrNullColumn extends string = never> extends PostgresCMSObjectEntity<
  DefaultOrNullColumn | 'condition'
> {
  @Environment()
  environmentID!: string;

  @ObjectIDPrimaryKey()
  id!: string;

  @Enum(() => ResponseVariantType)
  type!: ResponseVariantType;

  @ManyToOne(() => BaseConditionEntity, {
    name: 'condition_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
    fieldNames: ['environment_id', 'condition_id'],
  })
  condition!: Ref<BaseConditionEntity> | null;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @ManyToOne(() => ResponseDiscriminatorEntity, {
    name: 'discriminator_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'discriminator_id'],
  })
  discriminator!: Ref<ResponseDiscriminatorEntity>;

  @Property({ type: ArrayType })
  attachmentOrder!: string[];

  [PrimaryKeyType]?: CMSCompositePK;
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: ResponseVariantType.JSON,
})
export class JSONResponseVariantEntity extends BaseResponseVariantEntity {
  type!: typeof ResponseVariantType.JSON;

  @Property({ type: MarkupType })
  json!: Markup;
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: ResponseVariantType.PROMPT,
})
export class PromptResponseVariantEntity extends BaseResponseVariantEntity<'prompt'> {
  type!: typeof ResponseVariantType.PROMPT;

  @Property()
  turns!: number;

  @ManyToOne(() => PromptEntity, {
    name: 'prompt_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
    fieldNames: ['environment_id', 'prompt_id'],
  })
  prompt!: Ref<PromptEntity> | null;

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

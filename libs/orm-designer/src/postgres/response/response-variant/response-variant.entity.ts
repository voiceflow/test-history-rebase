import {
  ArrayType,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKeyType,
  Property,
  ref,
  Unique,
} from '@mikro-orm/core';

import type { Markup } from '@/common';
import { MarkupType } from '@/common';
import { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity, SoftDelete } from '@/postgres/common';
import { BaseConditionEntity } from '@/postgres/condition';
import { PromptEntity } from '@/postgres/prompt';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { BaseResponseAttachmentEntity } from '../response-attachment/response-attachment.entity';
import { ResponseDiscriminatorEntity } from '../response-discriminator/response-discriminator.entity';
import { CardLayout } from './card-layout.enum';
import { ResponseContext } from './response-context.enum';
import { ResponseVariantType } from './response-variant-type.enum';

const TABLE_NAME = 'designer.response_variant';

@Entity({
  abstract: true,
  tableName: TABLE_NAME,
  discriminatorColumn: 'type',
})
@Unique({ properties: ['id', 'environmentID'] })
@SoftDelete()
export class BaseResponseVariantEntity extends PostgresCMSObjectEntity {
  static resolveBaseForeignKeys<
    Entity extends BaseResponseVariantEntity,
    Data extends ResolveForeignKeysParams<Entity>
  >({
    conditionID,
    assistantID,
    environmentID,
    discriminatorID,
    ...data
  }: Data & ResolveForeignKeysParams<BaseResponseVariantEntity>) {
    return {
      ...data,
      ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
      ...(environmentID !== undefined && {
        environmentID,
        ...(conditionID !== undefined && {
          condition: conditionID ? ref(BaseConditionEntity, { id: conditionID, environmentID }) : null,
        }),
        ...(discriminatorID !== undefined && {
          discriminator: ref(ResponseDiscriminatorEntity, { id: discriminatorID, environmentID }),
        }),
      }),
    } as ResolvedForeignKeys<Entity, Data>;
  }

  static resolveForeignKeys(data: ResolveForeignKeysParams<BaseResponseVariantEntity>) {
    return this.resolveBaseForeignKeys(data);
  }

  @Enum(() => ResponseVariantType)
  type: ResponseVariantType;

  @ManyToOne(() => BaseConditionEntity, {
    name: 'condition_id',
    default: null,
    fieldNames: ['condition_id', 'environment_id'],
  })
  condition: Ref<BaseConditionEntity> | null;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @OneToMany(() => BaseResponseAttachmentEntity, (value) => value.variant)
  attachments = new Collection<BaseResponseAttachmentEntity>(this);

  @ManyToOne(() => ResponseDiscriminatorEntity, {
    name: 'discriminator_id',
    fieldNames: ['discriminator_id', 'environment_id'],
  })
  discriminator: Ref<ResponseDiscriminatorEntity>;

  @Environment()
  environmentID: string;

  @Property({ type: ArrayType })
  attachmentOrder: string[];

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<BaseResponseVariantEntity>) {
    super(data);

    ({
      type: this.type,
      condition: this.condition,
      assistant: this.assistant,
      discriminator: this.discriminator,
      environmentID: this.environmentID,
      attachmentOrder: this.attachmentOrder,
    } = BaseResponseVariantEntity.resolveBaseForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      assistantID: this.assistant.id,
      conditionID: this.condition?.id ?? null,
      environmentID: this.environmentID,
      discriminatorID: this.discriminator.id,
    };
  }
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: ResponseVariantType.JSON,
})
export class JSONResponseVariantEntity extends BaseResponseVariantEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<JSONResponseVariantEntity>>(data: Data) {
    return {
      ...super.resolveBaseForeignKeys(data),
    } as ResolvedForeignKeys<JSONResponseVariantEntity, Data>;
  }

  type: ResponseVariantType.JSON = ResponseVariantType.JSON;

  @Property({ type: MarkupType })
  json: Markup;

  constructor({ json, ...data }: EntityCreateParams<JSONResponseVariantEntity, 'type'>) {
    super({ ...data, type: ResponseVariantType.JSON });

    ({ json: this.json } = JSONResponseVariantEntity.resolveForeignKeys({ json }));
  }
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: ResponseVariantType.PROMPT,
})
export class PromptResponseVariantEntity extends BaseResponseVariantEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<PromptResponseVariantEntity>>({
    promptID,
    ...data
  }: Data) {
    return {
      ...super.resolveBaseForeignKeys(data),
      ...(promptID !== undefined &&
        data.environmentID !== undefined && {
          prompt: promptID ? ref(PromptEntity, { id: promptID, environmentID: data.environmentID }) : null,
        }),
    } as ResolvedForeignKeys<PromptResponseVariantEntity, Data>;
  }

  type: ResponseVariantType.PROMPT = ResponseVariantType.PROMPT;

  @Property()
  turns: number;

  @ManyToOne(() => PromptEntity, { name: 'prompt_id', default: null, fieldNames: ['prompt_id', 'environment_id'] })
  prompt: Ref<PromptEntity> | null;

  @Enum(() => ResponseContext)
  context: ResponseContext;

  constructor({ turns, context, promptID, ...data }: EntityCreateParams<PromptResponseVariantEntity, 'type'>) {
    super({ ...data, type: ResponseVariantType.PROMPT });

    ({
      turns: this.turns,
      prompt: this.prompt,
      context: this.context,
    } = PromptResponseVariantEntity.resolveForeignKeys({ turns, context, promptID }));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      promptID: this.prompt?.id ?? null,
    };
  }
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: ResponseVariantType.TEXT,
})
export class TextResponseVariantEntity extends BaseResponseVariantEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<TextResponseVariantEntity>>(data: Data) {
    return {
      ...super.resolveBaseForeignKeys(data),
    } as ResolvedForeignKeys<TextResponseVariantEntity, Data>;
  }

  type: ResponseVariantType.TEXT = ResponseVariantType.TEXT;

  @Property({ type: MarkupType })
  text: Markup;

  @Property({ nullable: true, default: null })
  speed: number | null;

  @Enum(() => CardLayout)
  cardLayout: CardLayout;

  constructor({ text, speed, cardLayout, ...data }: EntityCreateParams<TextResponseVariantEntity, 'type'>) {
    super({ ...data, type: ResponseVariantType.TEXT });

    ({
      text: this.text,
      speed: this.speed,
      cardLayout: this.cardLayout,
    } = TextResponseVariantEntity.resolveForeignKeys({ text, speed, cardLayout }));
  }
}

export type AnyResponseVariantEntity =
  | PromptResponseVariantEntity
  | TextResponseVariantEntity
  | JSONResponseVariantEntity;

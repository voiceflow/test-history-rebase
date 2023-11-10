import {
  ArrayType,
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKeyType,
  Property,
  Unique,
  wrap,
} from '@mikro-orm/core';

import type { Markup } from '@/common';
import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import { BaseConditionEntity } from '@/postgres/condition';
import { PromptEntity } from '@/postgres/prompt';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import type { BaseResponseAttachmentEntity } from '../response-attachment/response-attachment.entity';
import { ResponseDiscriminatorEntity } from '../response-discriminator/response-discriminator.entity';
import { CardLayout } from './card-layout.enum';
import { ResponseContext } from './response-context.enum';
import {
  BaseResponseVariantJSONAdapter,
  JSONResponseVariantJSONAdapter,
  PromptResponseVariantJSONAdapter,
  TextResponseVariantJSONAdapter,
} from './response-variant.adapter';
import { ResponseVariantType } from './response-variant-type.enum';

const TABLE_NAME = 'designer.response_variant';

@Entity({
  abstract: true,
  tableName: TABLE_NAME,
  discriminatorColumn: 'type',
})
@Unique({ properties: ['id', 'environmentID'] })
export class BaseResponseVariantEntity extends PostgresCMSObjectEntity {
  static fromJSON(data: Partial<ToJSONWithForeignKeys<BaseResponseVariantEntity>>) {
    return BaseResponseVariantJSONAdapter.toDB(data);
  }

  @Enum(() => ResponseVariantType)
  type: ResponseVariantType;

  @ManyToOne(() => BaseConditionEntity, {
    name: 'condition_id',
    default: null,
    onDelete: 'set default',
    fieldNames: ['condition_id', 'environment_id'],
  })
  condition: Ref<BaseConditionEntity> | null = null;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @OneToMany('BaseResponseAttachmentEntity', (value: BaseResponseAttachmentEntity) => value.variant)
  attachments = new Collection<BaseResponseAttachmentEntity>(this);

  @ManyToOne(() => ResponseDiscriminatorEntity, {
    name: 'discriminator_id',
    onDelete: 'cascade',
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
    } = BaseResponseVariantEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<BaseResponseVariantEntity> {
    return BaseResponseVariantJSONAdapter.fromDB({
      ...wrap<BaseResponseVariantEntity>(this).toObject(...args),
      assistant: this.assistant,
      condition: this.condition ?? null,
      discriminator: this.discriminator,
    });
  }
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: ResponseVariantType.JSON,
})
export class JSONResponseVariantEntity extends BaseResponseVariantEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<JSONResponseVariantEntity>>>(data: JSON) {
    return JSONResponseVariantJSONAdapter.toDB<JSON>(data);
  }

  type: typeof ResponseVariantType.JSON = ResponseVariantType.JSON;

  @Property({ type: MarkupType })
  json: Markup;

  constructor({ json, ...data }: EntityCreateParams<JSONResponseVariantEntity, 'type'>) {
    super({ ...data, type: ResponseVariantType.JSON });

    ({ json: this.json } = JSONResponseVariantEntity.fromJSON({ json }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<JSONResponseVariantEntity> {
    return JSONResponseVariantJSONAdapter.fromDB({
      ...wrap<JSONResponseVariantEntity>(this).toObject(...args),
      assistant: this.assistant,
      condition: this.condition,
      discriminator: this.discriminator,
    });
  }
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: ResponseVariantType.PROMPT,
})
export class PromptResponseVariantEntity extends BaseResponseVariantEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<PromptResponseVariantEntity>>>(data: JSON) {
    return PromptResponseVariantJSONAdapter.toDB<JSON>(data);
  }

  type: typeof ResponseVariantType.PROMPT = ResponseVariantType.PROMPT;

  @Property()
  turns: number;

  @ManyToOne(() => PromptEntity, {
    name: 'prompt_id',
    default: null,
    onDelete: 'set default',
    fieldNames: ['prompt_id', 'environment_id'],
  })
  prompt: Ref<PromptEntity> | null = null;

  @Enum(() => ResponseContext)
  context: ResponseContext;

  constructor({ turns, context, promptID, ...data }: EntityCreateParams<PromptResponseVariantEntity, 'type'>) {
    super({ ...data, type: ResponseVariantType.PROMPT });

    ({
      turns: this.turns,
      prompt: this.prompt,
      context: this.context,
    } = PromptResponseVariantEntity.fromJSON({ turns, context, promptID }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<PromptResponseVariantEntity> {
    return PromptResponseVariantJSONAdapter.fromDB({
      ...wrap<PromptResponseVariantEntity>(this).toObject(...args),
      prompt: this.prompt ?? null,
      assistant: this.assistant,
      condition: this.condition,
      discriminator: this.discriminator,
    });
  }
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: ResponseVariantType.TEXT,
})
export class TextResponseVariantEntity extends BaseResponseVariantEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<TextResponseVariantEntity>>>(data: JSON) {
    return TextResponseVariantJSONAdapter.toDB<JSON>(data);
  }

  type: typeof ResponseVariantType.TEXT = ResponseVariantType.TEXT;

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
    } = TextResponseVariantEntity.fromJSON({ text, speed, cardLayout }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<TextResponseVariantEntity> {
    return TextResponseVariantJSONAdapter.fromDB({
      ...wrap<TextResponseVariantEntity>(this).toObject(...args),
      assistant: this.assistant,
      condition: this.condition,
      discriminator: this.discriminator,
    });
  }
}

export type AnyResponseVariantEntity =
  | PromptResponseVariantEntity
  | TextResponseVariantEntity
  | JSONResponseVariantEntity;

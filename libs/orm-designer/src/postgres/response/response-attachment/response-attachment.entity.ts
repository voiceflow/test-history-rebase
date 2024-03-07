import { Entity, Enum, ManyToOne, PrimaryKeyType, Unique, wrap } from '@mikro-orm/core';
import { AttachmentType } from '@voiceflow/dtos';

import type { AssistantEntity } from '@/postgres/assistant';
import { CardAttachmentEntity, MediaAttachmentEntity } from '@/postgres/attachment';
import { Assistant, Environment, PostgresCMSCreatableEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { BaseResponseVariantEntity } from '../response-variant/response-variant.entity';
import {
  BaseResponseAttachmentEntityAdapter,
  ResponseCardAttachmentEntityAdapter,
  ResponseMediaAttachmentEntityAdapter,
} from './response-attachment-entity.adapter';

const TABLE_NAME = 'designer.response_attachment';

@Entity({
  abstract: true,
  tableName: TABLE_NAME,
  discriminatorColumn: 'type',
})
@Unique({ properties: ['id', 'environmentID'] })
export class BaseResponseAttachmentEntity extends PostgresCMSCreatableEntity {
  static fromJSON(data: Partial<ToJSONWithForeignKeys<BaseResponseAttachmentEntity>>) {
    return BaseResponseAttachmentEntityAdapter.toDB(data);
  }

  @Enum(() => AttachmentType)
  type: AttachmentType;

  @ManyToOne(() => BaseResponseVariantEntity, {
    name: 'variant_id',
    onDelete: 'cascade',
    fieldNames: ['variant_id', 'environment_id'],
  })
  variant: Ref<BaseResponseVariantEntity>;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<BaseResponseAttachmentEntity>) {
    super(data);

    ({
      type: this.type,
      variant: this.variant,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = BaseResponseAttachmentEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<BaseResponseAttachmentEntity> {
    return BaseResponseAttachmentEntityAdapter.fromDB({
      ...wrap<BaseResponseAttachmentEntity>(this).toObject(...args),
      variant: this.variant,
      assistant: this.assistant,
    });
  }
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: AttachmentType.CARD,
})
export class ResponseCardAttachmentEntity extends BaseResponseAttachmentEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ResponseCardAttachmentEntity>>>(data: JSON) {
    return ResponseCardAttachmentEntityAdapter.toDB<JSON>(data);
  }

  type: typeof AttachmentType.CARD = AttachmentType.CARD;

  @ManyToOne(() => CardAttachmentEntity, {
    name: 'card_id',
    onDelete: 'cascade',
    fieldNames: ['card_id', 'environment_id'],
  })
  card: Ref<CardAttachmentEntity>;

  constructor({ cardID, ...data }: EntityCreateParams<ResponseCardAttachmentEntity, 'type'>) {
    super({ ...data, type: AttachmentType.CARD });

    ({ card: this.card } = ResponseCardAttachmentEntity.fromJSON({ cardID }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<ResponseCardAttachmentEntity> {
    return ResponseCardAttachmentEntityAdapter.fromDB({
      ...wrap<ResponseCardAttachmentEntity>(this).toObject(...args),
      card: this.card,
      variant: this.variant,
      assistant: this.assistant,
    });
  }
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: AttachmentType.MEDIA,
})
export class ResponseMediaAttachmentEntity extends BaseResponseAttachmentEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<ResponseMediaAttachmentEntity>>>(data: JSON) {
    return ResponseMediaAttachmentEntityAdapter.toDB<JSON>(data);
  }

  type: typeof AttachmentType.MEDIA = AttachmentType.MEDIA;

  @ManyToOne(() => MediaAttachmentEntity, {
    name: 'media_id',
    onDelete: 'cascade',
    fieldNames: ['media_id', 'environment_id'],
  })
  media: Ref<MediaAttachmentEntity>;

  constructor({ mediaID, ...data }: EntityCreateParams<ResponseMediaAttachmentEntity, 'type'>) {
    super({ ...data, type: AttachmentType.MEDIA });

    ({ media: this.media } = ResponseMediaAttachmentEntity.fromJSON({ mediaID }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<ResponseMediaAttachmentEntity> {
    return ResponseMediaAttachmentEntityAdapter.fromDB({
      ...wrap<ResponseMediaAttachmentEntity>(this).toObject(...args),
      media: this.media,
      variant: this.variant,
      assistant: this.assistant,
    });
  }
}

export type AnyResponseAttachmentEntity = ResponseCardAttachmentEntity | ResponseMediaAttachmentEntity;

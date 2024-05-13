import { Entity, Enum, ManyToOne, PrimaryKeyType } from '@mikro-orm/core';
import { AttachmentType } from '@voiceflow/dtos';

import type { AssistantEntity } from '@/postgres/assistant';
import { CardAttachmentEntity, MediaAttachmentEntity } from '@/postgres/attachment';
import { Assistant, Environment, ObjectIDPrimaryKey, PostgresCMSCreatableEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { BaseResponseVariantEntity } from '../response-variant/response-variant.entity';

const TABLE_NAME = 'designer.response_attachment';

@Entity({
  abstract: true,
  tableName: TABLE_NAME,
  discriminatorColumn: 'type',
})
export class BaseResponseAttachmentEntity extends PostgresCMSCreatableEntity {
  @Environment()
  environmentID!: string;

  @ObjectIDPrimaryKey()
  id!: string;

  @Enum(() => AttachmentType)
  type!: AttachmentType;

  @ManyToOne(() => BaseResponseVariantEntity, {
    name: 'variant_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'variant_id'],
  })
  variant!: Ref<BaseResponseVariantEntity>;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  [PrimaryKeyType]?: CMSCompositePK;
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: AttachmentType.CARD,
})
export class ResponseCardAttachmentEntity extends BaseResponseAttachmentEntity {
  type!: typeof AttachmentType.CARD;

  @ManyToOne(() => CardAttachmentEntity, {
    name: 'card_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'card_id'],
  })
  card!: Ref<CardAttachmentEntity>;
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: AttachmentType.MEDIA,
})
export class ResponseMediaAttachmentEntity extends BaseResponseAttachmentEntity {
  type!: typeof AttachmentType.MEDIA;

  @ManyToOne(() => MediaAttachmentEntity, {
    name: 'media_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'media_id'],
  })
  media!: Ref<MediaAttachmentEntity>;
}

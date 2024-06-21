/* eslint-disable max-classes-per-file */
import { Entity, Enum, ManyToOne, PrimaryKeyProp, Unique } from '@mikro-orm/core';
import { AttachmentType } from '@voiceflow/dtos';

import type { AssistantEntity } from '@/postgres/assistant';
import { CardAttachmentEntity, MediaAttachmentEntity } from '@/postgres/attachment';
import { Assistant, Environment, PostgresCMSCreatableEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { BaseResponseVariantEntity } from '../response-variant/response-variant.entity';

const TABLE_NAME = 'designer.response_attachment';

@Entity({
  abstract: true,
  tableName: TABLE_NAME,
  discriminatorColumn: 'type',
})
@Unique({ properties: ['id', 'environmentID'] })
export class BaseResponseAttachmentEntity extends PostgresCMSCreatableEntity {
  @Enum(() => AttachmentType)
  type!: AttachmentType;

  @ManyToOne(() => BaseResponseVariantEntity, {
    name: 'variant_id',
    onDelete: 'cascade',
    fieldNames: ['variant_id', 'environment_id'],
  })
  variant!: Ref<BaseResponseVariantEntity>;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Environment()
  environmentID!: string;

  [PrimaryKeyProp]?: CMSCompositePK;
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
    fieldNames: ['card_id', 'environment_id'],
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
    fieldNames: ['media_id', 'environment_id'],
  })
  media!: Ref<MediaAttachmentEntity>;
}

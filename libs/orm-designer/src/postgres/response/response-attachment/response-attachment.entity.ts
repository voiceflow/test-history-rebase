import { Entity, Enum, ManyToOne, PrimaryKeyType, ref, Unique } from '@mikro-orm/core';

import { AssistantEntity } from '@/postgres/assistant';
import { AttachmentType, CardAttachmentEntity, MediaAttachmentEntity } from '@/postgres/attachment';
import { Assistant, Environment, PostgresCMSCreatableEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { BaseResponseVariantEntity } from '../response-variant/response-variant.entity';

const TABLE_NAME = 'designer.response_attachment';

@Entity({
  abstract: true,
  tableName: TABLE_NAME,
  discriminatorColumn: 'type',
})
@Unique({ properties: ['id', 'environmentID'] })
export class BaseResponseAttachmentEntity extends PostgresCMSCreatableEntity {
  static resolveBaseForeignKeys<
    Entity extends BaseResponseAttachmentEntity,
    Data extends ResolveForeignKeysParams<Entity>
  >({ variantID, assistantID, environmentID, ...data }: Data & ResolveForeignKeysParams<BaseResponseAttachmentEntity>) {
    return {
      ...data,
      ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
      ...(environmentID !== undefined && {
        environmentID,
        ...(variantID !== undefined && { variant: ref(BaseResponseVariantEntity, { id: variantID, environmentID }) }),
      }),
    } as ResolvedForeignKeys<Entity, Data>;
  }

  static resolveForeignKeys(data: ResolveForeignKeysParams<BaseResponseAttachmentEntity>) {
    return this.resolveBaseForeignKeys(data);
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
    } = BaseResponseAttachmentEntity.resolveBaseForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      variantID: this.variant.id,
      assistantID: this.assistant.id,
      environmentID: this.environmentID,
    };
  }
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: AttachmentType.CARD,
})
export class ResponseCardAttachmentEntity extends BaseResponseAttachmentEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<ResponseCardAttachmentEntity>>({
    cardID,
    ...data
  }: Data) {
    return {
      ...super.resolveBaseForeignKeys(data),
      ...(cardID !== undefined &&
        data.environmentID !== undefined && {
          card: ref(CardAttachmentEntity, { id: cardID, environmentID: data.environmentID }),
        }),
    } as ResolvedForeignKeys<ResponseCardAttachmentEntity, Data>;
  }

  type: AttachmentType.CARD = AttachmentType.CARD;

  @ManyToOne(() => CardAttachmentEntity, {
    name: 'card_id',
    onDelete: 'cascade',
    fieldNames: ['card_id', 'environment_id'],
  })
  card: Ref<CardAttachmentEntity>;

  constructor({ cardID, ...data }: EntityCreateParams<ResponseCardAttachmentEntity, 'type'>) {
    super({ ...data, type: AttachmentType.CARD });

    ({ card: this.card } = ResponseCardAttachmentEntity.resolveForeignKeys({ cardID }));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      cardID: this.card.id,
    };
  }
}

@Entity({
  tableName: TABLE_NAME,
  discriminatorValue: AttachmentType.MEDIA,
})
export class ResponseMediaAttachmentEntity extends BaseResponseAttachmentEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<ResponseMediaAttachmentEntity>>({
    mediaID,
    ...data
  }: Data) {
    return {
      ...super.resolveBaseForeignKeys(data),
      ...(mediaID !== undefined &&
        data.environmentID !== undefined && {
          media: ref(MediaAttachmentEntity, { id: mediaID, environmentID: data.environmentID }),
        }),
    } as ResolvedForeignKeys<ResponseMediaAttachmentEntity, Data>;
  }

  type: AttachmentType.MEDIA = AttachmentType.MEDIA;

  @ManyToOne(() => MediaAttachmentEntity, {
    name: 'media_id',
    onDelete: 'cascade',
    fieldNames: ['media_id', 'environment_id'],
  })
  media: Ref<MediaAttachmentEntity>;

  constructor({ mediaID, ...data }: EntityCreateParams<ResponseMediaAttachmentEntity, 'type'>) {
    super({ ...data, type: AttachmentType.MEDIA });

    ({ media: this.media } = ResponseMediaAttachmentEntity.resolveForeignKeys({ mediaID }));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      mediaID: this.media.id,
    };
  }
}

export type AnyResponseAttachmentEntity = ResponseCardAttachmentEntity | ResponseMediaAttachmentEntity;

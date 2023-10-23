import {
  ArrayType,
  Collection,
  Entity,
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
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { AttachmentType } from '../attachment-type.enum';
import { CardButtonEntity } from '../card-button/card-button.entity';
import { MediaAttachmentEntity } from '../media-attachment/media-attachment.entity';

@Entity({ tableName: 'designer.card_attachment' })
@Unique({ properties: ['id', 'environmentID'] })
export class CardAttachmentEntity extends PostgresCMSObjectEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<CardAttachmentEntity>>({
    mediaID,
    assistantID,
    environmentID,
    ...data
  }: Data) {
    return {
      ...data,
      ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
      ...(environmentID !== undefined && {
        environmentID,
        ...(mediaID !== undefined && {
          media: mediaID ? ref(MediaAttachmentEntity, { id: mediaID, environmentID }) : null,
        }),
      }),
    } as ResolvedForeignKeys<CardAttachmentEntity, Data>;
  }

  @Property({ type: MarkupType })
  title: Markup;

  @ManyToOne(() => MediaAttachmentEntity, {
    name: 'media_id',
    default: null,
    onDelete: 'set default',
    fieldNames: ['media_id', 'environment_id'],
  })
  media: Ref<MediaAttachmentEntity> | null;

  @OneToMany(() => CardButtonEntity, (value) => value.card)
  buttons = new Collection<CardButtonEntity>(this);

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Property({ type: MarkupType })
  description: Markup;

  @Property({ type: ArrayType })
  buttonOrder: string[];

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<CardAttachmentEntity>) {
    super(data);

    ({
      title: this.title,
      media: this.media,
      assistant: this.assistant,
      description: this.description,
      buttonOrder: this.buttonOrder,
      environmentID: this.environmentID,
    } = CardAttachmentEntity.resolveForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      type: AttachmentType.CARD as const,
      mediaID: this.media?.id ?? null,
      assistantID: this.assistant.id,
      environmentID: this.environmentID,
    };
  }
}

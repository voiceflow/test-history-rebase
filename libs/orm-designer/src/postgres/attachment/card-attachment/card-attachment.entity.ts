import {
  ArrayType,
  Collection,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryKeyType,
  Property,
  Unique,
  wrap,
} from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';
import { AttachmentType } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import type { CardButtonEntity } from '../card-button/card-button.entity';
import { MediaAttachmentEntity } from '../media-attachment/media-attachment.entity';
import { CardAttachmentEntityAdapter } from './card-attachment-entity.adapter';

@Entity({ tableName: 'designer.card_attachment' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class CardAttachmentEntity extends PostgresCMSObjectEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<CardAttachmentEntity>>>(data: JSON) {
    return CardAttachmentEntityAdapter.toDB<JSON>(data);
  }

  @Property({ type: MarkupType })
  title: Markup;

  @ManyToOne(() => MediaAttachmentEntity, {
    name: 'media_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
    fieldNames: ['media_id', 'environment_id'],
  })
  media: Ref<MediaAttachmentEntity> | null = null;

  @OneToMany('CardButtonEntity', (value: CardButtonEntity) => value.card)
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
    } = CardAttachmentEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<CardAttachmentEntity & { type: typeof AttachmentType.CARD }> {
    return {
      type: AttachmentType.CARD,

      ...CardAttachmentEntityAdapter.fromDB({
        ...wrap<CardAttachmentEntity>(this).toObject(...args),
        media: this.media ?? null,
        updatedBy: this.updatedBy,
        assistant: this.assistant,
      }),
    };
  }
}

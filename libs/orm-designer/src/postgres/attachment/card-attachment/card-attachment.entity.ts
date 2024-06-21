import { ArrayType, Entity, Index, ManyToOne, PrimaryKeyProp, Property, Unique } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { MediaAttachmentEntity } from '../media-attachment/media-attachment.entity';

@Entity({ tableName: 'designer.card_attachment' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class CardAttachmentEntity extends PostgresCMSObjectEntity<'media'> {
  @Property({ type: MarkupType })
  title!: Markup;

  @ManyToOne(() => MediaAttachmentEntity, {
    name: 'media_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
    fieldNames: ['media_id', 'environment_id'],
  })
  media!: Ref<MediaAttachmentEntity> | null;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Property({ type: MarkupType })
  description!: Markup;

  @Property({ type: ArrayType })
  buttonOrder!: string[];

  @Environment()
  environmentID!: string;

  [PrimaryKeyProp]?: CMSCompositePK;
}

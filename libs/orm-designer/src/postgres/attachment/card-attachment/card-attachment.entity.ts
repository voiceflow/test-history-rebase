import { ArrayType, Entity, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { MediaAttachmentEntity } from '../media-attachment/media-attachment.entity';

@Entity({ tableName: 'designer.card_attachment' })
export class CardAttachmentEntity extends PostgresCMSObjectEntity<'media'> {
  @Environment()
  environmentID!: string;

  @Property({ type: MarkupType })
  title!: Markup;

  @ManyToOne(() => MediaAttachmentEntity, {
    name: 'media_id',
    default: null,
    onDelete: 'set default',
    nullable: true,
    fieldNames: ['environment_id', 'media_id'],
  })
  media!: Ref<MediaAttachmentEntity> | null;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Property({ type: MarkupType })
  description!: Markup;

  @Property({ type: ArrayType })
  buttonOrder!: string[];

  [PrimaryKeyType]?: CMSCompositePK;
}

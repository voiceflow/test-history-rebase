import { Entity, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, ObjectIDPrimaryKey, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { CardAttachmentEntity } from '../card-attachment/card-attachment.entity';

@Entity({ tableName: 'designer.card_button' })
export class CardButtonEntity extends PostgresCMSObjectEntity {
  @Environment()
  environmentID!: string;

  @ObjectIDPrimaryKey()
  id!: string;

  @ManyToOne(() => CardAttachmentEntity, {
    name: 'card_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'card_id'],
  })
  card!: Ref<CardAttachmentEntity>;

  @Property({ type: MarkupType })
  label!: Markup;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  [PrimaryKeyType]?: CMSCompositePK;
}

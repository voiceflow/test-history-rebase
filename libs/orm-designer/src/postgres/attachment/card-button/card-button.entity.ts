import { Entity, Index, ManyToOne, PrimaryKeyProp, Property, Unique } from '@mikro-orm/core';
import type { Markup } from '@voiceflow/dtos';

import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { CardAttachmentEntity } from '../card-attachment/card-attachment.entity';

@Entity({ tableName: 'designer.card_button' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class CardButtonEntity extends PostgresCMSObjectEntity {
  @ManyToOne(() => CardAttachmentEntity, {
    name: 'card_id',
    onDelete: 'cascade',
    fieldNames: ['card_id', 'environment_id'],
  })
  card!: Ref<CardAttachmentEntity>;

  @Property({ type: MarkupType })
  label!: Markup;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Environment()
  environmentID!: string;

  [PrimaryKeyProp]?: CMSCompositePK;
}

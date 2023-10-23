import { Entity, ManyToOne, PrimaryKeyType, Property, ref, Unique } from '@mikro-orm/core';

import type { Markup } from '@/common';
import { MarkupType } from '@/common';
import { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { CardAttachmentEntity } from '../card-attachment/card-attachment.entity';

@Entity({ tableName: 'designer.card_button' })
@Unique({ properties: ['id', 'environmentID'] })
export class CardButtonEntity extends PostgresCMSObjectEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<CardButtonEntity>>({
    cardID,
    assistantID,
    environmentID,
    ...data
  }: Data) {
    return {
      ...data,
      ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
      ...(environmentID !== undefined && {
        environmentID,
        ...(cardID !== undefined && { card: cardID ? ref(CardAttachmentEntity, { id: cardID, environmentID }) : null }),
      }),
    } as ResolvedForeignKeys<CardButtonEntity, Data>;
  }

  @ManyToOne(() => CardAttachmentEntity, {
    name: 'card_id',
    onDelete: 'cascade',
    fieldNames: ['card_id', 'environment_id'],
  })
  card: Ref<CardAttachmentEntity>;

  @Property({ type: MarkupType })
  label: Markup;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<CardButtonEntity>) {
    super(data);

    ({
      card: this.card,
      label: this.label,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = CardButtonEntity.resolveForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      cardID: this.card.id,
      assistantID: this.assistant.id,
      environmentID: this.environmentID,
    };
  }
}

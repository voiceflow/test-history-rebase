import { Entity, Index, ManyToOne, PrimaryKeyType, Property, Unique, wrap } from '@mikro-orm/core';

import type { Markup } from '@/common';
import { MarkupType } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { CardAttachmentEntity } from '../card-attachment/card-attachment.entity';
import { CardButtonEntityAdapter } from './card-button-entity.adapter';

@Entity({ tableName: 'designer.card_button' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class CardButtonEntity extends PostgresCMSObjectEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<CardButtonEntity>>>(data: JSON) {
    return CardButtonEntityAdapter.toDB<JSON>(data);
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
    } = CardButtonEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<CardButtonEntity> {
    return CardButtonEntityAdapter.fromDB({
      ...wrap<CardButtonEntity>(this).toObject(...args),
      card: this.card,
      updatedBy: this.updatedBy,
      assistant: this.assistant,
    });
  }
}

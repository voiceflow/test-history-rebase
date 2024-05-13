import { Entity, Enum, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import { Language } from '@voiceflow/dtos';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, ObjectIDPrimaryKey, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { IntentEntity } from '../intent.entity';
import type { UtteranceText } from './utterance-text.dto';
import { UtteranceTextType } from './utterance-text.dto';

@Entity({ tableName: 'designer.utterance' })
export class UtteranceEntity extends PostgresCMSObjectEntity {
  @Environment()
  environmentID!: string;

  @ObjectIDPrimaryKey()
  id!: string;

  @Property({ type: UtteranceTextType })
  text!: UtteranceText;

  @ManyToOne(() => IntentEntity, {
    name: 'intent_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'intent_id'],
  })
  intent!: Ref<IntentEntity>;

  @Enum(() => Language)
  language!: Language;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  [PrimaryKeyType]?: CMSCompositePK;
}

import { Entity, Enum, Index, ManyToOne, PrimaryKeyProp, Property, Unique } from '@mikro-orm/core';
import { Language } from '@voiceflow/dtos';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { IntentEntity } from '../intent.entity';
import type { UtteranceText } from './utterance-text.dto';
import { UtteranceTextType } from './utterance-text.dto';

@Entity({ tableName: 'designer.utterance' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class UtteranceEntity extends PostgresCMSObjectEntity {
  @Property({ type: UtteranceTextType })
  text!: UtteranceText;

  @ManyToOne(() => IntentEntity, {
    name: 'intent_id',
    deleteRule: 'cascade',
    fieldNames: ['intent_id', 'environment_id'],
  })
  intent!: Ref<IntentEntity>;

  @Enum(() => Language)
  language!: Language;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Environment()
  environmentID!: string;

  [PrimaryKeyProp]?: CMSCompositePK;
}

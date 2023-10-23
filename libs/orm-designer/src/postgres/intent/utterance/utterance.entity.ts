import { Entity, Enum, ManyToOne, PrimaryKeyType, Property, ref, Unique } from '@mikro-orm/core';

import { Language } from '@/common';
import { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { IntentEntity } from '../intent.entity';
import type { UtteranceText } from './utterance-text.dto';
import { UtteranceTextType } from './utterance-text.dto';

@Entity({ tableName: 'designer.utterance' })
@Unique({ properties: ['id', 'environmentID'] })
export class UtteranceEntity extends PostgresCMSObjectEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<UtteranceEntity>>({
    intentID,
    assistantID,
    environmentID,
    ...data
  }: Data) {
    return {
      ...data,
      ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
      ...(environmentID !== undefined && {
        environmentID,
        ...(intentID !== undefined && { intent: ref(IntentEntity, { id: intentID, environmentID }) }),
      }),
    } as ResolvedForeignKeys<UtteranceEntity, Data>;
  }

  @Property({ type: UtteranceTextType })
  text: UtteranceText;

  @ManyToOne(() => IntentEntity, {
    name: 'intent_id',
    onDelete: 'cascade',
    fieldNames: ['intent_id', 'environment_id'],
  })
  intent: Ref<IntentEntity>;

  @Enum(() => Language)
  language: Language;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<UtteranceEntity>) {
    super(data);

    ({
      text: this.text,
      intent: this.intent,
      language: this.language,
      assistant: this.assistant,
      environmentID: this.environmentID,
    } = UtteranceEntity.resolveForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      intentID: this.intent.id,
      assistantID: this.assistant.id,
      environmentID: this.environmentID,
    };
  }
}

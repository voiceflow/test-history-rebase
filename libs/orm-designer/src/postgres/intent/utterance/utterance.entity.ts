import { Entity, Enum, ManyToOne, PrimaryKeyType, Property, Unique, wrap } from '@mikro-orm/core';

import { Language } from '@/common';
import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { IntentEntity } from '../intent.entity';
import { UtteranceJSONAdapter } from './utterance.adapter';
import type { UtteranceText } from './utterance-text.dto';
import { UtteranceTextType } from './utterance-text.dto';

@Entity({ tableName: 'designer.utterance' })
@Unique({ properties: ['id', 'environmentID'] })
export class UtteranceEntity extends PostgresCMSObjectEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<UtteranceEntity>>>(data: JSON) {
    return UtteranceJSONAdapter.toDB<JSON>(data);
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
    } = UtteranceEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<UtteranceEntity> {
    return UtteranceJSONAdapter.fromDB({
      ...wrap<UtteranceEntity>(this).toObject(...args),
      intent: this.intent,
      assistant: this.assistant,
    });
  }
}

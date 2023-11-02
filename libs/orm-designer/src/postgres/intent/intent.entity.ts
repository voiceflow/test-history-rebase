import { ArrayType, Collection, Entity, OneToMany, Property, Unique, wrap } from '@mikro-orm/core';

import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { IntentJSONAdapter } from './intent.adapter';
import type { RequiredEntityEntity } from './required-entity/required-entity.entity';
import type { UtteranceEntity } from './utterance/utterance.entity';

@Entity({ tableName: 'designer.intent' })
@Unique({ properties: ['id', 'environmentID'] })
export class IntentEntity extends PostgresCMSTabularEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<IntentEntity>>>(data: JSON) {
    return IntentJSONAdapter.toDB<JSON>(data);
  }

  @Property({ default: null })
  description: string | null;

  @Property()
  automaticReprompt: boolean;

  @Property({ type: ArrayType })
  entityOrder: string[];

  @OneToMany('UtteranceEntity', (value: UtteranceEntity) => value.intent)
  utterances = new Collection<UtteranceEntity>(this);

  @OneToMany('RequiredEntityEntity', (value: RequiredEntityEntity) => value.intent)
  requiredEntities = new Collection<RequiredEntityEntity>(this);

  constructor({ description, entityOrder, automaticReprompt, ...data }: EntityCreateParams<IntentEntity>) {
    super(data);

    ({
      description: this.description,
      entityOrder: this.entityOrder,
      automaticReprompt: this.automaticReprompt,
    } = IntentEntity.fromJSON({ description, entityOrder, automaticReprompt }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<IntentEntity> {
    return IntentJSONAdapter.fromDB({
      ...wrap<IntentEntity>(this).toObject(...args),
      folder: this.folder ?? null,
      assistant: this.assistant,
    });
  }
}

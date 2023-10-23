import { ArrayType, Collection, Entity, OneToMany, Property, Unique } from '@mikro-orm/core';

import type { EntityCreateParams, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { PostgresCMSTabularEntity } from '../common';
import { RequiredEntityEntity } from './required-entity/required-entity.entity';
import { UtteranceEntity } from './utterance/utterance.entity';

@Entity({ tableName: 'designer.intent' })
@Unique({ properties: ['id', 'environmentID'] })
export class IntentEntity extends PostgresCMSTabularEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<IntentEntity>>(data: Data) {
    return {
      ...super.resolveTabularForeignKeys(data),
    } as ResolvedForeignKeys<IntentEntity, Data>;
  }

  @Property({ default: null })
  description: string | null;

  @Property()
  automaticReprompt: boolean;

  @Property({ type: ArrayType })
  entityOrder: string[];

  @OneToMany(() => UtteranceEntity, (value) => value.intent)
  utterances = new Collection<UtteranceEntity>(this);

  @OneToMany(() => RequiredEntityEntity, (value) => value.intent)
  requiredEntities = new Collection<RequiredEntityEntity>(this);

  constructor({ description, entityOrder, automaticReprompt, ...data }: EntityCreateParams<IntentEntity>) {
    super(data);

    ({
      description: this.description,
      entityOrder: this.entityOrder,
      automaticReprompt: this.automaticReprompt,
    } = IntentEntity.resolveForeignKeys({ description, entityOrder, automaticReprompt }));
  }
}

import { Entity, Enum, ManyToOne, PrimaryKeyType, Property, Unique, wrap } from '@mikro-orm/core';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ToJSONWithForeignKeys } from '@/types';

import { PersonaEntity } from '../persona.entity';
import { PersonaModel } from '../persona-model.enum';
import { PersonaOverrideJSONAdapter } from './persona-override.adapter';

@Entity({ tableName: 'designer.persona_override' })
@Unique({ properties: ['id', 'environmentID'] })
export class PersonaOverrideEntity extends PostgresCMSObjectEntity {
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<PersonaOverrideEntity>>>(data: JSON) {
    return PersonaOverrideJSONAdapter.toDB<JSON>(data);
  }

  @Property({ default: null })
  name: string | null;

  @Enum({ items: () => PersonaModel, default: null })
  model: PersonaModel | null;

  @ManyToOne(() => PersonaEntity, {
    name: 'persona_id',
    onDelete: 'cascade',
    fieldNames: ['persona_id', 'environment_id'],
  })
  persona: Ref<PersonaEntity>;

  @Property({ default: null })
  maxLength: number | null;

  @Assistant()
  assistant: Ref<AssistantEntity>;

  @Property({ default: null })
  temperature: number | null;

  @Property({ default: null })
  systemPrompt: string | null;

  @Environment()
  environmentID: string;

  [PrimaryKeyType]?: CMSCompositePK;

  constructor(data: EntityCreateParams<PersonaOverrideEntity>) {
    super(data);

    ({
      name: this.name,
      model: this.model,
      persona: this.persona,
      maxLength: this.maxLength,
      assistant: this.assistant,
      temperature: this.temperature,
      systemPrompt: this.systemPrompt,
      environmentID: this.environmentID,
    } = PersonaOverrideEntity.fromJSON(data));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<PersonaOverrideEntity> {
    return PersonaOverrideJSONAdapter.fromDB({
      ...wrap<PersonaOverrideEntity>(this).toObject(...args),
      persona: this.persona,
      assistant: this.assistant,
    });
  }
}

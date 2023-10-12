import { Entity, Enum, ManyToOne, PrimaryKeyType, Property, ref, Unique } from '@mikro-orm/core';

import { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity, SoftDelete } from '@/postgres/common';
import type { CMSCompositePK, EntityCreateParams, Ref, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { PersonaEntity } from '../persona.entity';
import { PersonaModel } from '../persona-model.enum';

@Entity({ tableName: 'designer.persona_override' })
@Unique({ properties: ['id', 'environmentID'] })
@SoftDelete()
export class PersonaOverrideEntity extends PostgresCMSObjectEntity {
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<PersonaOverrideEntity>>({
    personaID,
    assistantID,
    environmentID,
    ...data
  }: Data) {
    return {
      ...data,
      ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
      ...(environmentID !== undefined && {
        environmentID,
        ...(personaID !== undefined && { persona: ref(PersonaEntity, { id: personaID, environmentID }) }),
      }),
    } as ResolvedForeignKeys<PersonaOverrideEntity, Data>;
  }

  @Property({ default: null })
  name: string | null;

  @Enum({ items: () => PersonaModel, default: null })
  model: PersonaModel | null;

  @ManyToOne(() => PersonaEntity, { name: 'persona_id', fieldNames: ['persona_id', 'environment_id'] })
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
    super();

    ({
      name: this.name,
      model: this.model,
      persona: this.persona,
      maxLength: this.maxLength,
      assistant: this.assistant,
      temperature: this.temperature,
      systemPrompt: this.systemPrompt,
      environmentID: this.environmentID,
    } = PersonaOverrideEntity.resolveForeignKeys(data));
  }

  toJSON(...args: any[]) {
    return {
      ...super.toJSON(...args),
      personaID: this.persona.id,
      assistantID: this.assistant.id,
      environmentID: this.environmentID,
    };
  }
}

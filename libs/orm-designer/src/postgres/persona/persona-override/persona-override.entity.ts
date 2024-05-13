import { Entity, Enum, ManyToOne, PrimaryKeyType, Property } from '@mikro-orm/core';
import { AIModel } from '@voiceflow/dtos';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, ObjectIDPrimaryKey, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { PersonaEntity } from '../persona.entity';

@Entity({ tableName: 'designer.persona_override' })
export class PersonaOverrideEntity extends PostgresCMSObjectEntity<'name' | 'model' | 'maxLength' | 'temperature' | 'systemPrompt'> {
  @Environment()
  environmentID!: string;

  @ObjectIDPrimaryKey()
  id!: string;

  @Property({ default: null, nullable: true })
  name!: string | null;

  @Enum({ items: () => AIModel, default: null, nullable: true })
  model!: AIModel | null;

  @ManyToOne(() => PersonaEntity, {
    name: 'persona_id',
    onDelete: 'cascade',
    fieldNames: ['environment_id', 'persona_id'],
  })
  persona!: Ref<PersonaEntity>;

  @Property({ default: null, nullable: true })
  maxLength!: number | null;

  @Assistant()
  assistant!: Ref<AssistantEntity>;

  @Property({ default: null, nullable: true })
  temperature!: number | null;

  @Property({ type: 'text', default: null, nullable: true })
  systemPrompt!: string | null;

  [PrimaryKeyType]?: CMSCompositePK;
}

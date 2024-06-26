import { Entity, Enum, Index, ManyToOne, PrimaryKeyProp, Property, Unique } from '@mikro-orm/core';
import { AIModel } from '@voiceflow/dtos';

import type { AssistantEntity } from '@/postgres/assistant';
import { Assistant, Environment, PostgresCMSObjectEntity } from '@/postgres/common';
import type { CMSCompositePK, Ref } from '@/types';

import { PersonaEntity } from '../persona.entity';

@Entity({ tableName: 'designer.persona_override' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class PersonaOverrideEntity extends PostgresCMSObjectEntity<
  'name' | 'model' | 'maxLength' | 'temperature' | 'systemPrompt'
> {
  @Property({ default: null, nullable: true })
  name!: string | null;

  @Enum({ items: () => AIModel, default: null, nullable: true })
  model!: AIModel | null;

  @ManyToOne(() => PersonaEntity, {
    name: 'persona_id',
    deleteRule: 'cascade',
    fieldNames: ['persona_id', 'environment_id'],
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

  @Environment()
  environmentID!: string;

  [PrimaryKeyProp]?: CMSCompositePK;
}

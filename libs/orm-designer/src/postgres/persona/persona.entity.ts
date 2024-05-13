import { Entity, Enum, Property } from '@mikro-orm/core';
import { AIModel } from '@voiceflow/dtos';

import type { DEFAULT_OR_NULL_COLUMN } from '@/types';

import { PostgresCMSTabularEntity } from '../common/entities/postgres-cms-tabular.entity';
import type { PersonaOverrideEntity } from './persona-override/persona-override.entity';

@Entity({ tableName: 'designer.persona' })
export class PersonaEntity extends PostgresCMSTabularEntity implements Omit<PersonaOverrideEntity, 'persona' | typeof DEFAULT_OR_NULL_COLUMN> {
  @Enum(() => AIModel)
  model!: AIModel;

  @Property()
  maxLength!: number;

  @Property()
  temperature!: number;

  @Property({ type: 'text' })
  systemPrompt!: string;
}

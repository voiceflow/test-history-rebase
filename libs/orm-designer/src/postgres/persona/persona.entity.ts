import { Entity, Enum, Index, Property, Unique, wrap } from '@mikro-orm/core';
import { AIModel } from '@voiceflow/dtos';

import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { PostgresCMSTabularEntity } from '../common/entities/postgres-cms-tabular.entity';
import { PersonaEntityAdapter } from './persona-entity.adapter';
import type { PersonaOverrideEntity } from './persona-override/persona-override.entity';

@Entity({ tableName: 'designer.persona' })
@Unique({ properties: ['id', 'environmentID'] })
@Index({ properties: ['environmentID'] })
export class PersonaEntity
  extends PostgresCMSTabularEntity
  implements Omit<PersonaOverrideEntity, 'persona' | 'toJSON'>
{
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<PersonaEntity>>>(data: JSON) {
    return PersonaEntityAdapter.toDB<JSON>(data);
  }

  @Enum(() => AIModel)
  model: AIModel;

  @Property()
  maxLength: number;

  @Property()
  temperature: number;

  @Property({ type: 'text' })
  systemPrompt: string;

  constructor({ model, maxLength, temperature, systemPrompt, ...data }: EntityCreateParams<PersonaEntity>) {
    super(data);

    ({
      model: this.model,
      maxLength: this.maxLength,
      temperature: this.temperature,
      systemPrompt: this.systemPrompt,
    } = PersonaEntity.fromJSON({ model, maxLength, temperature, systemPrompt }));
  }

  toJSON(...args: any[]): ToJSONWithForeignKeys<PersonaEntity> {
    return PersonaEntityAdapter.fromDB({
      ...wrap<PersonaEntity>(this).toObject(...args),
      folder: this.folder ?? null,
      updatedBy: this.updatedBy,
      createdBy: this.createdBy,
      assistant: this.assistant,
    });
  }
}

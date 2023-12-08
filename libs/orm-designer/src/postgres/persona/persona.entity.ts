import { Entity, Enum, Property, Unique, wrap } from '@mikro-orm/core';

import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { PostgresCMSTabularEntity } from '../common/entities/postgres-cms-tabular.entity';
import { PersonaJSONAdapter } from './persona.adapter';
import { PersonaModel } from './persona-model.enum';
import type { PersonaOverrideEntity } from './persona-override/persona-override.entity';

@Entity({ tableName: 'designer.persona' })
@Unique({ properties: ['id', 'environmentID'] })
export class PersonaEntity
  extends PostgresCMSTabularEntity
  implements Omit<PersonaOverrideEntity, 'persona' | 'toJSON'>
{
  static fromJSON<JSON extends Partial<ToJSONWithForeignKeys<PersonaEntity>>>(data: JSON) {
    return PersonaJSONAdapter.toDB<JSON>(data);
  }

  @Enum(() => PersonaModel)
  model: PersonaModel;

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
    return PersonaJSONAdapter.fromDB({
      ...wrap<PersonaEntity>(this).toObject(...args),
      folder: this.folder ?? null,
      assistant: this.assistant,
    });
  }
}

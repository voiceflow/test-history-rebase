import { Entity, Enum, Property, Unique } from '@mikro-orm/core';

import type { EntityCreateParams, ToJSONWithForeignKeys } from '@/types';

import { PostgresCMSTabularEntity } from '../common/entities/postgres-cms-tabular.entity';
import { PersonaJSONAdapter } from './persona.adapter';
import { PersonaModel } from './persona-model.enum';
import type { PersonaOverrideEntity } from './persona-override/persona-override.entity';

@Entity({ tableName: 'designer.persona' })
@Unique({ properties: ['id', 'environmentID'] })
export class PersonaEntity
  extends PostgresCMSTabularEntity
  implements Omit<PersonaOverrideEntity, 'persona' | 'toJSON' | 'wrap'>
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

  @Property()
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

  toJSON(): ToJSONWithForeignKeys<PersonaEntity> {
    return PersonaJSONAdapter.fromDB({
      ...this.wrap<PersonaEntity>(),
      folder: this.folder,
      assistant: this.assistant,
    });
  }
}

import { Entity, Enum, Property, Unique } from '@mikro-orm/core';

import type { EntityCreateParams, ResolvedForeignKeys, ResolveForeignKeysParams } from '@/types';

import { SoftDelete } from '../common/decorators/soft-delete.decorator';
import { PostgresCMSTabularEntity } from '../common/entities/postgres-cms-tabular.entity';
import { PersonaModel } from './persona-model.enum';
import type { PersonaOverrideEntity } from './persona-override';

@Entity({ tableName: 'designer.persona' })
@Unique({ properties: ['id', 'environmentID'] })
@SoftDelete()
export class PersonaEntity
  extends PostgresCMSTabularEntity
  implements Omit<PersonaOverrideEntity, 'persona' | 'toJSON'>
{
  static resolveForeignKeys<Data extends ResolveForeignKeysParams<PersonaEntity>>(data: Data) {
    return {
      ...super.resolveTabularForeignKeys(data),
    } as ResolvedForeignKeys<PersonaEntity, Data>;
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
    } = PersonaEntity.resolveForeignKeys({ model, maxLength, temperature, systemPrompt }));
  }
}

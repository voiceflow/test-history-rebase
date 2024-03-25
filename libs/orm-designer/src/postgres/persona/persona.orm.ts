import { PostgresCMSTabularORM } from '../common/orms/postgres-cms-tabular.orm';
import { PersonaEntity } from './persona.entity';
import { PersonaJSONAdapter } from './persona-json.adapter';

export class PersonaORM extends PostgresCMSTabularORM<PersonaEntity> {
  Entity = PersonaEntity;

  jsonAdapter = PersonaJSONAdapter;
}

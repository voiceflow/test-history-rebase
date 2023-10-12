import { PostgresCMSTabularORM } from '../common/postgres-cms-tabular.orm';
import { PersonaEntity } from './persona.entity';

export class PersonaORM extends PostgresCMSTabularORM(PersonaEntity) {}

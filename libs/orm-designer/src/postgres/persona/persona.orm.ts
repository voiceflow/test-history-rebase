import { PostgresCMSTabularORM } from '../common/orms/postgres-cms-tabular.orm';
import { PersonaEntity } from './persona.entity';

export class PersonaORM extends PostgresCMSTabularORM(PersonaEntity) {}

import { PostgresCMSTabularORM } from '../common';
import { VariableEntity } from './variable.entity';

export class VariableORM extends PostgresCMSTabularORM(VariableEntity) {}

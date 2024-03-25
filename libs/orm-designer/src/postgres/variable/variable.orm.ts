import { PostgresCMSTabularORM } from '../common';
import { VariableEntity } from './variable.entity';
import { VariableJSONAdapter } from './variable-json.adapter';

export class VariableORM extends PostgresCMSTabularORM<VariableEntity> {
  Entity = VariableEntity;

  jsonAdapter = VariableJSONAdapter;
}

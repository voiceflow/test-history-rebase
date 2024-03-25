import { PostgresCMSTabularORM } from '../common';
import { FunctionEntity } from './function.entity';
import { FunctionJSONAdapter } from './function-json.adapter';

export class FunctionORM extends PostgresCMSTabularORM<FunctionEntity> {
  Entity = FunctionEntity;

  jsonAdapter = FunctionJSONAdapter;
}

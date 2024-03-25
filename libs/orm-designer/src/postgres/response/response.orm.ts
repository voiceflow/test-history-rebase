import { PostgresCMSTabularORM } from '../common';
import { ResponseEntity } from './response.entity';
import { ResponseEntityAdapter } from './response-json.adapter';

export class ResponseORM extends PostgresCMSTabularORM<ResponseEntity> {
  Entity = ResponseEntity;

  jsonAdapter = ResponseEntityAdapter;

  findManyByEnvironment(environmentID: string) {
    return this.find({ environmentID });
  }

  deleteManyByEnvironment(environmentID: string) {
    return this.delete({ environmentID });
  }
}

import { PostgresObjectIDMutableORM } from '@/postgres/common/orms/postgres-object-id-mutable.orm';

import { ReferenceEntity } from './reference.entity';
import { ReferenceJSONAdapter } from './reference-json.adapter';

export class ReferenceORM extends PostgresObjectIDMutableORM<ReferenceEntity> {
  Entity = ReferenceEntity;

  jsonAdapter = ReferenceJSONAdapter;

  findManyByEnvironment(environmentID: string) {
    return this.find({ environmentID });
  }

  deleteManyByEnvironment(environmentID: string) {
    return this.delete({ environmentID });
  }
}

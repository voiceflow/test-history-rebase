import { PostgresObjectIDMutableORM } from '@/postgres/common/orms/postgres-object-id-mutable.orm';

import { ReferenceResourceEntity } from './reference-resource.entity';
import { ReferenceResourceJSONAdapter } from './reference-resource-json.adapter';

export class ReferenceResourceORM extends PostgresObjectIDMutableORM<ReferenceResourceEntity> {
  Entity = ReferenceResourceEntity;

  jsonAdapter = ReferenceResourceJSONAdapter;
}

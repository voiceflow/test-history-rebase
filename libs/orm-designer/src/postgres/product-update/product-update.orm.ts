import { PostgresMutableORM } from '@/postgres/common/orms/postgres-mutable.orm';

import { ProductUpdateEntity } from './product-update.entity';
import { ProductUpdateJSONAdapter } from './product-update-json.adapter';

export class ProductUpdateORM extends PostgresMutableORM<ProductUpdateEntity> {
  Entity = ProductUpdateEntity;

  jsonAdapter = ProductUpdateJSONAdapter;
}

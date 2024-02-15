import { PostgresMutableORM } from '@/postgres/common/orms/postgres-mutable.orm';

import { ProductUpdateEntity } from './product-update.entity';

export class ProductUpdateORM extends PostgresMutableORM(ProductUpdateEntity) {}

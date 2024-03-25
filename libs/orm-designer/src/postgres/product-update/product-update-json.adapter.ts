import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCreatableJSONAdapter } from '@/postgres/common';

import type { ProductUpdateJSON, ProductUpdateObject } from './product-update.interface';

export const ProductUpdateJSONAdapter = createSmartMultiAdapter<ProductUpdateObject, ProductUpdateJSON>(
  PostgresCreatableJSONAdapter.fromDB,
  PostgresCreatableJSONAdapter.toDB
);

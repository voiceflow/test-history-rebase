import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCreatableJSONAdapter, ref } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import { UserStubEntity } from '../stubs/user.stub';
import type { ProductUpdateEntity } from './product-update.entity';

export const ProductUpdateJSONAdapter = createSmartMultiAdapter<
  EntityObject<ProductUpdateEntity>,
  ToJSONWithForeignKeys<ProductUpdateEntity>,
  [],
  [],
  [['creator', 'creatorID']]
>(
  ({ created, creator, ...data }) => ({
    ...PostgresCreatableJSONAdapter.fromDB(data),

    ...(created !== undefined && { created: created?.toJSON() ?? null }),

    ...(creator !== undefined && { creatorID: creator ? creator.id : null }),
  }),
  ({ created, creatorID, ...data }) => ({
    ...PostgresCreatableJSONAdapter.toDB(data),

    ...(created !== undefined && { created: created ? new Date(created) : null }),

    ...(creatorID !== undefined && { creator: creatorID ? ref(UserStubEntity, creatorID) : null }),
  })
);

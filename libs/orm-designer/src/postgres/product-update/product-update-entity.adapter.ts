import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCreatableEntityAdapter, ref } from '@/postgres/common';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import { UserStubEntity } from '../stubs/user.stub';
import type { ProductUpdateEntity } from './product-update.entity';

export const ProductUpdateEntityAdapter = createSmartMultiAdapter<
  EntityObject<ProductUpdateEntity>,
  ToJSONWithForeignKeys<ProductUpdateEntity>,
  [],
  [],
  [['creator', 'creatorID']]
>(
  ({ created, creator, ...data }) => ({
    ...PostgresCreatableEntityAdapter.fromDB(data),

    ...(created !== undefined && { created: created?.toJSON() ?? null }),

    ...(creator !== undefined && { creatorID: creator ? creator.id : null }),
  }),
  ({ created, creatorID, ...data }) => ({
    ...PostgresCreatableEntityAdapter.toDB(data),

    ...(created !== undefined && { created: created ? new Date(created) : null }),

    ...(creatorID !== undefined && { creator: creatorID ? ref(UserStubEntity, creatorID) : null }),
  })
);

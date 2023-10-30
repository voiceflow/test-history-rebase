import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { PostgresMutableEntity } from '../entities/postgres-mutable.entity';

export const PostgresMutableJSONAdapter = createSmartMultiAdapter<
  EntityObject<PostgresMutableEntity>,
  ToJSONWithForeignKeys<PostgresMutableEntity>
>(
  ({ updatedAt, ...data }) => ({
    ...data,

    ...(updatedAt !== undefined && { updatedAt: updatedAt.toJSON() }),
  }),
  ({ updatedAt, ...data }) => ({
    ...data,

    ...(updatedAt !== undefined && { updatedAt: new Date(updatedAt) }),
  })
);

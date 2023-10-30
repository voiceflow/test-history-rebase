import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { PostgresCMSCreatableEntity } from '../entities/postgres-cms-creatable.entity';

export const PostgresCMSCreatableJSONAdapter = createSmartMultiAdapter<
  EntityObject<PostgresCMSCreatableEntity>,
  ToJSONWithForeignKeys<PostgresCMSCreatableEntity>
>(
  ({ createdAt, ...data }) => ({
    ...data,

    ...(createdAt !== undefined && { createdAt: createdAt.toJSON() }),
  }),
  ({ createdAt, ...data }) => ({
    ...data,

    ...(createdAt !== undefined && { createdAt: new Date(createdAt) }),
  })
);

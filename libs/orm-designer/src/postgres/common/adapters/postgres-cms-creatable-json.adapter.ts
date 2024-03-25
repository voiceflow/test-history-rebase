import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { PostgresCMSCreatableJSON, PostgresCMSCreatableObject } from '../entities/postgres-cms-creatable.entity';

export const PostgresCMSCreatableJSONAdapter = createSmartMultiAdapter<
  PostgresCMSCreatableObject,
  PostgresCMSCreatableJSON
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

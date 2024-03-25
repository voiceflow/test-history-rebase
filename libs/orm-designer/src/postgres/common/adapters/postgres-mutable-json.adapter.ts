import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { PostgresMutableJSON, PostgresMutableObject } from '../entities/postgres-mutable.entity';

export const PostgresMutableJSONAdapter = createSmartMultiAdapter<PostgresMutableObject, PostgresMutableJSON>(
  ({ updatedAt, ...data }) => ({
    ...data,

    ...(updatedAt !== undefined && { updatedAt: updatedAt.toJSON() }),
  }),
  ({ updatedAt, ...data }) => ({
    ...data,

    ...(updatedAt !== undefined && { updatedAt: new Date(updatedAt) }),
  })
);

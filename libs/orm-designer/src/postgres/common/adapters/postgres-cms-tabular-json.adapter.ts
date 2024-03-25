import { createSmartMultiAdapter } from 'bidirectional-adapter';

import type { PostgresCMSTabularJSON, PostgresCMSTabularObject } from '../entities/postgres-cms-tabular.entity';
import { PostgresCMSObjectJSONAdapter } from './postgres-cms-object-json.adapter';

export const PostgresCMSTabularJSONAdapter = createSmartMultiAdapter<PostgresCMSTabularObject, PostgresCMSTabularJSON>(
  ({ updatedByID, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.fromDB(data),

    ...(updatedByID !== undefined && { updatedByID }),
  }),
  ({ updatedByID, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.toDB(data),

    ...(updatedByID !== undefined && { updatedByID }),
  })
);

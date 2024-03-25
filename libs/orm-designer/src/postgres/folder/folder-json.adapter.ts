import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common/adapters/postgres-cms-object-json.adapter';

import type { FolderJSON, FolderObject } from './folder.interface';

export const FolderJSONAdapter = createSmartMultiAdapter<FolderObject, FolderJSON>(
  PostgresCMSObjectJSONAdapter.fromDB,
  PostgresCMSObjectJSONAdapter.toDB
);

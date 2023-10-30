import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant/assistant.entity';
import { FolderEntity } from '@/postgres/folder/folder.entity';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { PostgresCMSTabularEntity } from '../entities/postgres-cms-tabular.entity';
import { ref } from '../ref.util';
import { PostgresCMSObjectJSONAdapter } from './postgres-cms-object.adapter';

export type CMSTabularKeyRemap<T extends [string, string][] = []> = CMSKeyRemap<[['folder', 'folderID'], ...T]>;

export const PostgresCMSTabularJSONAdapter = createSmartMultiAdapter<
  EntityObject<PostgresCMSTabularEntity>,
  ToJSONWithForeignKeys<PostgresCMSTabularEntity>,
  [],
  [],
  CMSTabularKeyRemap
>(
  ({ folder, assistant, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.fromDB(data),

    ...(folder !== undefined && { folderID: folder?.id ?? null }),

    ...(assistant !== undefined && { assistantID: assistant.id }),
  }),
  ({ folderID, assistantID, environmentID, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(environmentID !== undefined && {
      environmentID,
      ...(folderID !== undefined && {
        folder: folderID ? ref(FolderEntity, { id: folderID, environmentID }) : null,
      }),
    }),
  })
);

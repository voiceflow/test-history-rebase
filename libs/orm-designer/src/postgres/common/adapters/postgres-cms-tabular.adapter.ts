import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant/assistant.entity';
import { FolderEntity } from '@/postgres/folder/folder.entity';
import { UserStubEntity } from '@/postgres/stubs/user.stub';
import type { EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { PostgresCMSTabularEntity } from '../entities/postgres-cms-tabular.entity';
import { ref } from '../ref.util';
import type { CMSObjectKeyRemap } from './postgres-cms-object.adapter';
import { PostgresCMSObjectJSONAdapter } from './postgres-cms-object.adapter';

export type CMSTabularKeyRemap<T extends [string, string][] = []> = CMSObjectKeyRemap<
  [['folder', 'folderID'], ['createdBy', 'createdByID'], ...T]
>;

export const PostgresCMSTabularJSONAdapter = createSmartMultiAdapter<
  EntityObject<PostgresCMSTabularEntity>,
  ToJSONWithForeignKeys<PostgresCMSTabularEntity>,
  [],
  [],
  CMSTabularKeyRemap
>(
  ({ folder, assistant, updatedBy, createdBy, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.fromDB(data),

    ...(folder !== undefined && { folderID: folder?.id ?? null }),

    ...(assistant !== undefined && { assistantID: assistant.id }),

    ...(updatedBy !== undefined && { updatedByID: updatedBy?.id ?? null }),

    ...(createdBy !== undefined && { createdByID: createdBy.id }),
  }),
  ({ folderID, assistantID, updatedByID, createdByID, environmentID, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(updatedByID !== undefined && { updatedBy: ref(UserStubEntity, updatedByID) }),

    ...(createdByID !== undefined && { createdBy: ref(UserStubEntity, createdByID) }),

    ...(environmentID !== undefined && {
      environmentID,
      ...(folderID !== undefined && {
        folder: folderID ? ref(FolderEntity, { id: folderID, environmentID }) : null,
      }),
    }),
  })
);

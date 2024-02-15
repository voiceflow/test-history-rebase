import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectEntityAdapter } from '@/postgres/common/adapters/postgres-cms-object-entity.adapter';
import { ref } from '@/postgres/common/ref.util';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { FolderEntity } from './folder.entity';

export const FolderEntityAdapter = createSmartMultiAdapter<
  EntityObject<FolderEntity>,
  ToJSONWithForeignKeys<FolderEntity>,
  [],
  [],
  CMSKeyRemap<[['parent', 'parentID']]>
>(
  ({ parent, assistant, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.fromDB(data),

    ...(parent !== undefined && { parentID: parent?.id ?? null }),

    ...(assistant !== undefined && { assistantID: assistant.id }),
  }),
  ({ parentID, assistantID, environmentID, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(environmentID !== undefined && {
      environmentID,

      ...(parentID !== undefined && {
        parent: parentID ? ref(FolderEntity, { id: parentID, environmentID }) : null,
      }),
    }),
  })
);

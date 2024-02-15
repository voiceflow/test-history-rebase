import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectEntityAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { MediaAttachmentEntity } from './media-attachment.entity';

export const MediaAttachmentEntityAdapter = createSmartMultiAdapter<
  EntityObject<MediaAttachmentEntity>,
  ToJSONWithForeignKeys<MediaAttachmentEntity>,
  [],
  [],
  CMSKeyRemap
>(
  ({ assistant, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.fromDB(data),

    ...(assistant !== undefined && { assistantID: assistant.id }),
  }),
  ({ assistantID, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
  })
);

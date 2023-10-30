import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectJSONAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import type { MediaAttachmentEntity } from './media-attachment.entity';

export const MediaAttachmentJSONAdapter = createSmartMultiAdapter<
  EntityObject<MediaAttachmentEntity>,
  ToJSONWithForeignKeys<MediaAttachmentEntity>,
  [],
  [],
  CMSKeyRemap
>(
  ({ assistant, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.fromDB(data),

    ...(assistant !== undefined && { assistantID: assistant.id }),
  }),
  ({ assistantID, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),
  })
);

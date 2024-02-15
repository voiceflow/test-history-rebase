import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectEntityAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { MediaAttachmentEntity } from '../media-attachment/media-attachment.entity';
import type { CardAttachmentEntity } from './card-attachment.entity';

export const CardAttachmentEntityAdapter = createSmartMultiAdapter<
  EntityObject<CardAttachmentEntity>,
  ToJSONWithForeignKeys<CardAttachmentEntity>,
  [],
  [],
  CMSKeyRemap<[['media', 'mediaID']]>
>(
  ({ media, assistant, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.fromDB(data),

    ...(media !== undefined && { mediaID: media?.id ?? null }),

    ...(assistant !== undefined && { assistantID: assistant.id }),
  }),
  ({ mediaID, assistantID, environmentID, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(environmentID !== undefined && {
      environmentID,

      ...(mediaID !== undefined && {
        media: mediaID ? ref(MediaAttachmentEntity, { id: mediaID, environmentID }) : null,
      }),
    }),
  })
);

import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common';

import type { MediaAttachmentJSON, MediaAttachmentObject } from './media-attachment.interface';

export const MediaAttachmentJSONAdapter = createSmartMultiAdapter<MediaAttachmentObject, MediaAttachmentJSON>(
  (data) => PostgresCMSObjectJSONAdapter.fromDB(data),
  (data) => PostgresCMSObjectJSONAdapter.toDB(data)
);

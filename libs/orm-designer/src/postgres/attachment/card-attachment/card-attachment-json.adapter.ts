import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { PostgresCMSObjectJSONAdapter } from '@/postgres/common';

import type { CardAttachmentJSON, CardAttachmentObject } from './card-attachment.interface';

export const CardAttachmentJSONAdapter = createSmartMultiAdapter<CardAttachmentObject, CardAttachmentJSON>(
  PostgresCMSObjectJSONAdapter.fromDB,
  PostgresCMSObjectJSONAdapter.toDB
);

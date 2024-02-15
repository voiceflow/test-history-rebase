import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectEntityAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { CardAttachmentEntity } from '../card-attachment/card-attachment.entity';
import type { CardButtonEntity } from './card-button.entity';

export const CardButtonEntityAdapter = createSmartMultiAdapter<
  EntityObject<CardButtonEntity>,
  ToJSONWithForeignKeys<CardButtonEntity>,
  [],
  [],
  CMSKeyRemap<[['card', 'cardID']]>
>(
  ({ card, assistant, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.fromDB(data),

    ...(card !== undefined && { cardID: card?.id ?? null }),

    ...(assistant !== undefined && { assistantID: assistant.id }),
  }),
  ({ cardID, assistantID, environmentID, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(environmentID !== undefined && {
      environmentID,

      ...(cardID !== undefined && { card: ref(CardAttachmentEntity, { id: cardID, environmentID }) }),
    }),
  })
);

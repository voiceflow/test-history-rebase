import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectJSONAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { ResponseEntity } from '../response.entity';
import type { ResponseDiscriminatorEntity } from './response-discriminator.entity';

export const ResponseDiscriminatorJSONAdapter = createSmartMultiAdapter<
  EntityObject<ResponseDiscriminatorEntity>,
  ToJSONWithForeignKeys<ResponseDiscriminatorEntity>,
  [],
  [],
  CMSKeyRemap<[['response', 'responseID']]>
>(
  ({ response, assistant, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.fromDB(data),

    ...(response !== undefined && { responseID: response.id }),

    ...(assistant !== undefined && { assistantID: assistant.id }),
  }),
  ({ responseID, assistantID, environmentID, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(environmentID !== undefined && {
      environmentID,

      ...(responseID !== undefined && {
        response: ref(ResponseEntity, { id: responseID, environmentID }),
      }),
    }),
  })
);

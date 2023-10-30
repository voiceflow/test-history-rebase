import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectJSONAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { FunctionEntity } from '../function.entity';
import type { FunctionPathEntity } from './function-path.entity';

export const FunctionPatchJSONAdapter = createSmartMultiAdapter<
  EntityObject<FunctionPathEntity>,
  ToJSONWithForeignKeys<FunctionPathEntity>,
  [],
  [],
  CMSKeyRemap<[['function', 'functionID']]>
>(
  ({ function: func, assistant, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.fromDB(data),

    ...(func !== undefined && { functionID: func.id }),

    ...(assistant !== undefined && { assistantID: assistant.id }),
  }),
  ({ functionID, assistantID, environmentID, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(environmentID !== undefined && {
      environmentID,

      ...(functionID !== undefined && {
        function: ref(FunctionEntity, { id: functionID, environmentID }),
      }),
    }),
  })
);

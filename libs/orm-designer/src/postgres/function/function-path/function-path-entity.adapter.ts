import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectEntityAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { FunctionEntity } from '../function.entity';
import type { FunctionPathEntity } from './function-path.entity';

export const FunctionPatchEntityAdapter = createSmartMultiAdapter<
  EntityObject<FunctionPathEntity>,
  ToJSONWithForeignKeys<FunctionPathEntity>,
  [],
  [],
  CMSKeyRemap<[['function', 'functionID']]>
>(
  ({ function: func, assistant, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.fromDB(data),

    ...(func !== undefined && { functionID: func.id }),

    ...(assistant !== undefined && { assistantID: assistant.id }),
  }),
  ({ functionID, assistantID, environmentID, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(environmentID !== undefined && {
      environmentID,

      ...(functionID !== undefined && {
        function: ref(FunctionEntity, { id: functionID, environmentID }),
      }),
    }),
  })
);

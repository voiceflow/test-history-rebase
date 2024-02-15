import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectEntityAdapter, ref } from '@/postgres/common';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { FunctionEntity } from '../function.entity';
import type { FunctionVariableEntity } from './function-variable.entity';

export const FunctionVariableEntityAdapter = createSmartMultiAdapter<
  EntityObject<FunctionVariableEntity>,
  ToJSONWithForeignKeys<FunctionVariableEntity>,
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

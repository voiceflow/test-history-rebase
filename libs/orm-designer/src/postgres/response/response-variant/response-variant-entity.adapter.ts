import { ResponseVariantType } from '@voiceflow/dtos';
import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectEntityAdapter, ref } from '@/postgres/common';
import { BaseConditionEntity } from '@/postgres/condition';
import { PromptEntity } from '@/postgres/prompt';
import type { CMSKeyRemap, EntityObject, ToJSONWithForeignKeys } from '@/types';

import { ResponseDiscriminatorEntity } from '../response-discriminator/response-discriminator.entity';
import type {
  BaseResponseVariantEntity,
  JSONResponseVariantEntity,
  PromptResponseVariantEntity,
  TextResponseVariantEntity,
} from './response-variant.entity';

export const BaseResponseVariantEntityAdapter = createSmartMultiAdapter<
  EntityObject<BaseResponseVariantEntity>,
  ToJSONWithForeignKeys<BaseResponseVariantEntity>,
  [],
  [],
  CMSKeyRemap<[['condition', 'conditionID'], ['discriminator', 'discriminatorID']]>
>(
  ({ condition, assistant, discriminator, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.fromDB(data),

    ...(condition !== undefined && { conditionID: condition?.id ?? null }),

    ...(assistant !== undefined && { assistantID: assistant.id }),

    ...(discriminator !== undefined && { discriminatorID: discriminator.id }),
  }),
  ({ conditionID, assistantID, environmentID, discriminatorID, ...data }) => ({
    ...PostgresCMSObjectEntityAdapter.toDB(data),

    ...(assistantID !== undefined && { assistant: ref(AssistantEntity, assistantID) }),

    ...(environmentID !== undefined && {
      environmentID,

      ...(conditionID !== undefined && {
        condition: conditionID ? ref(BaseConditionEntity, { id: conditionID, environmentID }) : null,
      }),

      ...(discriminatorID !== undefined && {
        discriminator: ref(ResponseDiscriminatorEntity, { id: discriminatorID, environmentID }),
      }),
    }),
  })
);

export const JSONResponseVariantEntityAdapter = createSmartMultiAdapter<
  EntityObject<JSONResponseVariantEntity>,
  ToJSONWithForeignKeys<JSONResponseVariantEntity>,
  [],
  [],
  CMSKeyRemap<[['condition', 'conditionID'], ['discriminator', 'discriminatorID']]>
>(
  ({ type, ...data }) => ({
    ...BaseResponseVariantEntityAdapter.fromDB(data),

    ...(type !== undefined && { type: ResponseVariantType.JSON }),
  }),
  ({ type, ...data }) => ({
    ...BaseResponseVariantEntityAdapter.toDB(data),

    ...(type !== undefined && { type: ResponseVariantType.JSON }),
  })
);

export const PromptResponseVariantEntityAdapter = createSmartMultiAdapter<
  EntityObject<PromptResponseVariantEntity>,
  ToJSONWithForeignKeys<PromptResponseVariantEntity>,
  [],
  [],
  CMSKeyRemap<[['prompt', 'promptID'], ['condition', 'conditionID'], ['discriminator', 'discriminatorID']]>
>(
  ({ type, prompt, ...data }) => ({
    ...BaseResponseVariantEntityAdapter.fromDB(data),

    ...(type !== undefined && { type: ResponseVariantType.PROMPT }),

    ...(prompt !== undefined && { promptID: prompt?.id ?? null }),
  }),
  ({ type, promptID, ...data }) => ({
    ...BaseResponseVariantEntityAdapter.toDB(data),

    ...(type !== undefined && { type: ResponseVariantType.PROMPT }),

    ...(promptID !== undefined &&
      data.environmentID !== undefined && {
        prompt: promptID ? ref(PromptEntity, { id: promptID, environmentID: data.environmentID }) : null,
      }),
  })
);

export const TextResponseVariantEntityAdapter = createSmartMultiAdapter<
  EntityObject<TextResponseVariantEntity>,
  ToJSONWithForeignKeys<TextResponseVariantEntity>,
  [],
  [],
  CMSKeyRemap<[['condition', 'conditionID'], ['discriminator', 'discriminatorID']]>
>(
  ({ type, ...data }) => ({
    ...BaseResponseVariantEntityAdapter.fromDB(data),

    ...(type !== undefined && { type: ResponseVariantType.TEXT }),
  }),
  ({ type, ...data }) => ({
    ...BaseResponseVariantEntityAdapter.toDB(data),

    ...(type !== undefined && { type: ResponseVariantType.TEXT }),
  })
);

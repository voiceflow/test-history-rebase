import { createSmartMultiAdapter } from 'bidirectional-adapter';

import { AssistantEntity } from '@/postgres/assistant';
import { PostgresCMSObjectJSONAdapter, ref } from '@/postgres/common';
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
import { ResponseVariantType } from './response-variant-type.enum';

export const BaseResponseVariantJSONAdapter = createSmartMultiAdapter<
  EntityObject<BaseResponseVariantEntity>,
  ToJSONWithForeignKeys<BaseResponseVariantEntity>,
  [],
  [],
  CMSKeyRemap<[['condition', 'conditionID'], ['discriminator', 'discriminatorID']]>
>(
  ({ condition, assistant, discriminator, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.fromDB(data),

    ...(condition !== undefined && { conditionID: condition?.id ?? null }),

    ...(assistant !== undefined && { assistantID: assistant.id }),

    ...(discriminator !== undefined && { discriminatorID: discriminator.id }),
  }),
  ({ conditionID, assistantID, environmentID, discriminatorID, ...data }) => ({
    ...PostgresCMSObjectJSONAdapter.toDB(data),

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

export const JSONResponseVariantJSONAdapter = createSmartMultiAdapter<
  EntityObject<JSONResponseVariantEntity>,
  ToJSONWithForeignKeys<JSONResponseVariantEntity>,
  [],
  [],
  CMSKeyRemap<[['condition', 'conditionID'], ['discriminator', 'discriminatorID']]>
>(
  ({ type, ...data }) => ({
    ...BaseResponseVariantJSONAdapter.fromDB(data),

    ...(type !== undefined && { type: ResponseVariantType.JSON }),
  }),
  ({ type, ...data }) => ({
    ...BaseResponseVariantJSONAdapter.toDB(data),

    ...(type !== undefined && { type: ResponseVariantType.JSON }),
  })
);

export const PromptResponseVariantJSONAdapter = createSmartMultiAdapter<
  EntityObject<PromptResponseVariantEntity>,
  ToJSONWithForeignKeys<PromptResponseVariantEntity>,
  [],
  [],
  CMSKeyRemap<[['prompt', 'promptID'], ['condition', 'conditionID'], ['discriminator', 'discriminatorID']]>
>(
  ({ type, prompt, ...data }) => ({
    ...BaseResponseVariantJSONAdapter.fromDB(data),

    ...(type !== undefined && { type: ResponseVariantType.PROMPT }),

    ...(prompt !== undefined && { promptID: prompt?.id ?? null }),
  }),
  ({ type, promptID, ...data }) => ({
    ...BaseResponseVariantJSONAdapter.toDB(data),

    ...(type !== undefined && { type: ResponseVariantType.PROMPT }),

    ...(promptID !== undefined &&
      data.environmentID !== undefined && {
        prompt: promptID ? ref(PromptEntity, { id: promptID, environmentID: data.environmentID }) : null,
      }),
  })
);

export const TextResponseVariantJSONAdapter = createSmartMultiAdapter<
  EntityObject<TextResponseVariantEntity>,
  ToJSONWithForeignKeys<TextResponseVariantEntity>,
  [],
  [],
  CMSKeyRemap<[['condition', 'conditionID'], ['discriminator', 'discriminatorID']]>
>(
  ({ type, ...data }) => ({
    ...BaseResponseVariantJSONAdapter.fromDB(data),

    ...(type !== undefined && { type: ResponseVariantType.TEXT }),
  }),
  ({ type, ...data }) => ({
    ...BaseResponseVariantJSONAdapter.toDB(data),

    ...(type !== undefined && { type: ResponseVariantType.TEXT }),
  })
);

import type {
  JSONResponseVariantEntity,
  PromptResponseVariantEntity,
  ResponseCardAttachmentEntity,
  ResponseMediaAttachmentEntity,
  ResponseORM,
  TextResponseVariantEntity,
  ToJSONWithForeignKeys,
} from '@voiceflow/orm-designer';

import type { CreateOneForUserData } from '@/common/types';

import {
  ResponseJSONVariantCreateWithSubResourcesData,
  ResponseTextVariantCreateWithSubResourcesData,
} from './response-variant/response-variant.interface';

export interface ResponseCreateWithSubResourcesData extends CreateOneForUserData<ResponseORM> {
  variants: Array<
    | ResponseTextVariantCreateWithSubResourcesData<'assistantID' | 'environmentID' | 'discriminatorID'>
    | ResponseJSONVariantCreateWithSubResourcesData<'assistantID' | 'environmentID' | 'discriminatorID'>
  >;
}

export type ResponseAnyVariantImportData =
  | ToJSONWithForeignKeys<TextResponseVariantEntity>
  | ToJSONWithForeignKeys<JSONResponseVariantEntity>
  | ToJSONWithForeignKeys<PromptResponseVariantEntity>;

export type ResponseAnyAttachmentImportData =
  | ToJSONWithForeignKeys<ResponseCardAttachmentEntity>
  | ToJSONWithForeignKeys<ResponseMediaAttachmentEntity>;

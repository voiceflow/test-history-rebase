import type { ResponseORM } from '@voiceflow/orm-designer';

import type { CMSCreateForUserData } from '@/common/types';

import type {
  ResponseJSONVariantCreateWithSubResourcesData,
  ResponseTextVariantCreateWithSubResourcesData,
} from './response-variant/response-variant.interface';

export interface ResponseCreateWithSubResourcesData extends CMSCreateForUserData<ResponseORM> {
  variants: Array<
    | ResponseTextVariantCreateWithSubResourcesData<'discriminatorID'>
    | ResponseJSONVariantCreateWithSubResourcesData<'discriminatorID'>
  >;
}

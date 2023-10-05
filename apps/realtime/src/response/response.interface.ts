import type { ResponseORM } from '@voiceflow/orm-designer';

import type { CreateOneForUserData } from '@/common/types';

import {
  ResponseJSONVariantCreateRefData,
  ResponsePromptVariantCreateRefData,
  ResponseTextVariantCreateRefData,
} from './response-variant/response-variant.interface';

export interface ResponseCreateRefData extends CreateOneForUserData<ResponseORM> {
  variants: Array<
    | ResponseTextVariantCreateRefData<'assistantID' | 'environmentID' | 'discriminatorID'>
    | ResponseJSONVariantCreateRefData<'assistantID' | 'environmentID' | 'discriminatorID'>
    | ResponsePromptVariantCreateRefData<'assistantID' | 'environmentID' | 'discriminatorID'>
  >;
}

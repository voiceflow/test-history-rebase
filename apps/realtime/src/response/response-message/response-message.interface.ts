import type { ResponseMessageCreate } from '@voiceflow/dtos';
import type { ResponseMessageORM } from '@voiceflow/orm-designer';

import type { CMSCreateForUserData } from '@/common';

export interface ResponseMessageCreateData extends CMSCreateForUserData<ResponseMessageORM> {}

interface ResponseBaseVariantCreateWithSubResourcesData {
  condition: ResponseMessageCreate['condition'];
}

export type ResponseMessageCreateWithSubResourcesData<Exclude extends keyof ResponseMessageCreateData = never> =
  ResponseBaseVariantCreateWithSubResourcesData &
    Omit<ResponseMessageCreateData, 'attachmentOrder' | 'conditionID' | Exclude>;

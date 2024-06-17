import type { Nullish } from '@voiceflow/common';
import { Entity, ResponseMessage, Variable } from '@voiceflow/dtos';

import type { CMSResourceSearchContext } from '../../contexts/CMSManager/CMSManager.interface';

export interface CMSMessageSortContext {
  entitiesMapByID: Partial<Record<string, Entity>>;
  variablesMapByID: Partial<Record<string, Variable>>;
  getVariantByResponseID: (params: { responseID: Nullish<string> }) => ResponseMessage | null;
}

export interface CMSMessageSearchContext extends CMSResourceSearchContext, CMSMessageSortContext {}

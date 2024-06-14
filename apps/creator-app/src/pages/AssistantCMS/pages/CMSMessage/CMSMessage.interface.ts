import type { Nullish } from '@voiceflow/common';
import { AnyResponseVariant, Entity, Variable } from '@voiceflow/dtos';

import type { CMSResourceSearchContext } from '../../contexts/CMSManager/CMSManager.interface';

export interface CMSMessageSortContext {
  entitiesMapByID: Partial<Record<string, Entity>>;
  variablesMapByID: Partial<Record<string, Variable>>;
  getVariantByResponseID: (params: { responseID: Nullish<string> }) => AnyResponseVariant | null;
}

export interface CMSMessageSearchContext extends CMSResourceSearchContext, CMSMessageSortContext {}

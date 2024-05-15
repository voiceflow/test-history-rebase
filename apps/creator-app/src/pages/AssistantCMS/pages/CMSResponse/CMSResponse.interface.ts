import type { Nullish } from '@voiceflow/common';
import { AnyResponseVariant, Entity, Prompt, Variable } from '@voiceflow/dtos';

import type { CMSResourceSearchContext } from '../../contexts/CMSManager/CMSManager.interface';

export interface CMSResponseSortContext {
  getPromptByID: (params: { id: Nullish<string> }) => Prompt | null;
  entitiesMapByID: Partial<Record<string, Entity>>;
  variablesMapByID: Partial<Record<string, Variable>>;
  getVariantByResponseID: (params: { responseID: Nullish<string> }) => AnyResponseVariant | null;
}

export interface CMSResponseSearchContext extends CMSResourceSearchContext, CMSResponseSortContext {}

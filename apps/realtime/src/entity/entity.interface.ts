import type { EntityVariant } from '@voiceflow/dtos';
import type { EntityORM } from '@voiceflow/orm-designer';

import type { CMSCreateForUserData } from '@/common/types';

export interface EntityCreateData extends CMSCreateForUserData<EntityORM> {
  variants?: Pick<EntityVariant, 'value' | 'synonyms'>[];
}

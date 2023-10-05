import type { EntityORM } from '@voiceflow/orm-designer';
import { type EntityVariant } from '@voiceflow/sdk-logux-designer';

import type { CreateOneForUserData } from '@/common/types';

export interface EntityCreateData extends CreateOneForUserData<EntityORM> {
  variants?: Pick<EntityVariant, 'value' | 'synonyms'>[];
}

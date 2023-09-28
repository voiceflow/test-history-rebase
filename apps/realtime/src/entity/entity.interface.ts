import type { EntityORM, Language } from '@voiceflow/orm-designer';

import { ObjectResource } from '@/common/object-resource.interface';
import type { CreateOneForUserData } from '@/common/types';

export interface EntityVariant extends ObjectResource {
  language: Language;
  value: string;
  synonyms: string[];
  entityID: string;
  assistantID: string;
}

export interface EntityCreateData extends CreateOneForUserData<EntityORM> {
  variants?: Pick<EntityVariant, 'value' | 'synonyms'>[];
}

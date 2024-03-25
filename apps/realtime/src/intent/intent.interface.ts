import type { RequiredEntityCreate } from '@voiceflow/dtos';
import type { IntentORM, UtteranceEntity } from '@voiceflow/orm-designer';

import type { CMSCreateForUserData } from '@/common/types';

export interface IntentCreateData extends CMSCreateForUserData<IntentORM> {
  utterances?: Pick<UtteranceEntity, 'text'>[];
  requiredEntities?: RequiredEntityCreate[];
}

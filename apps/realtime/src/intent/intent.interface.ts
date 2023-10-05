import type { IntentORM, UtteranceEntity } from '@voiceflow/orm-designer';
import type { RequiredEntityCreateData } from '@voiceflow/sdk-logux-designer';

import type { CreateOneForUserData } from '@/common/types';

export interface IntentCreateData extends CreateOneForUserData<IntentORM> {
  utterances?: Pick<UtteranceEntity, 'text'>[];
  requiredEntities?: RequiredEntityCreateData[];
}

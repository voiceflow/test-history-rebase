import type { FlowORM } from '@voiceflow/orm-designer';
import { Actions } from '@voiceflow/sdk-logux-designer';

import type { CreateOneForUserData } from '@/common/types';

export interface FlowAndDiagram {
  flow: Omit<CreateOneForUserData<FlowORM>, 'diagramID'>;
  diagram?: Actions.Flow.CreateData['diagram'];
}

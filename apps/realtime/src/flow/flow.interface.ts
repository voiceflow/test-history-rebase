import { Diagram } from '@voiceflow/dtos';
import type { FlowORM } from '@voiceflow/orm-designer';

import type { CreateOneForUserData } from '@/common/types';

export interface FlowCreateData {
  flow: Omit<CreateOneForUserData<FlowORM>, 'diagramID'>;
  diagram?: Omit<Diagram, '_id' | 'creatorID' | 'versionID' | 'intentStepIDs' | 'menuNodeIDs' | 'children' | 'diagramID'>;
}

import type { Diagram } from '@voiceflow/dtos';
import type { FlowORM } from '@voiceflow/orm-designer';

import type { CMSCreateForUserData } from '@/common/types';

export interface FlowCreateData extends Omit<CMSCreateForUserData<FlowORM>, 'diagramID'> {
  diagram?: Omit<
    Diagram,
    '_id' | 'creatorID' | 'versionID' | 'intentStepIDs' | 'menuNodeIDs' | 'children' | 'diagramID'
  >;
}

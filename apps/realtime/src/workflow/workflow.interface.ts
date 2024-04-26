import type { Diagram } from '@voiceflow/dtos';
import type { WorkflowORM } from '@voiceflow/orm-designer';

import type { CMSCreateForUserData } from '@/common/types';

export interface WorkflowCreateData extends Omit<CMSCreateForUserData<WorkflowORM>, 'diagramID'> {
  diagram?: Omit<
    Diagram,
    '_id' | 'creatorID' | 'versionID' | 'intentStepIDs' | 'menuNodeIDs' | 'children' | 'diagramID'
  >;
}

import type { FlowORM } from '@voiceflow/orm-designer';

import type { CreateOneForUserData } from '@/common/types';

export interface FlowCreateData extends Omit<CreateOneForUserData<FlowORM>, 'diagramID'> {}

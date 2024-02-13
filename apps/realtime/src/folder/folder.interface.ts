import type { FolderORM } from '@voiceflow/orm-designer';

import type { CreateOneForUserData } from '@/common/types';

export interface FolderCreateData extends CreateOneForUserData<FolderORM> {}

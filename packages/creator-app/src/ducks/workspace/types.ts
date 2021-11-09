import * as Realtime from '@voiceflow/realtime-sdk';

import { CRUDState } from '@/ducks/utils/crud';

export type WorkspaceState = CRUDState<Realtime.Workspace> & {
  activeWorkspaceID: string | null;
};

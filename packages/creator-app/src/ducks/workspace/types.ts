import { CRUDState } from '@/ducks/utils/crud';
import { Workspace } from '@/models';

export type WorkspaceState = CRUDState<Workspace> & {
  activeWorkspaceID: string | null;
};

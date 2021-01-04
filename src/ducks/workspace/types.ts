import { Workspace } from '@/models';
import { Normalized } from '@/utils/normalized';

export type WorkspaceState = Normalized<Workspace> & {
  activeWorkspaceID: string | null;
};

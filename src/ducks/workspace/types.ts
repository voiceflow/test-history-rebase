import { Workspace } from '@/models';

export type WorkspaceState = {
  allIds: string[];
  byId: Record<string, Workspace>;
  activeWorkspaceID: string | null;
};

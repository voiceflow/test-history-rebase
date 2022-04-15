import { Workspace } from '@realtime-sdk/models';

export const sortWorkspaces = (workspaces: Workspace[]) =>
  [...workspaces].sort((l, r) => (l.templates && 1) || (r.templates && -1) || 0).map((workspace) => ({ ...workspace }));

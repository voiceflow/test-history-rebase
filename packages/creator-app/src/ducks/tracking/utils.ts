import * as Session from '@/ducks/session';
import { SyncThunk, Thunk } from '@/store/types';

import { ProjectEventInfo, WorkspaceEventInfo } from './types';

export const createWorkspaceEventTracker =
  <T extends {} | undefined = undefined>(callback: (options: T & WorkspaceEventInfo, ...args: Parameters<Thunk>) => void) =>
  (...args: T extends undefined ? [] : [T]): SyncThunk =>
  (dispatch, getState, realtime) => {
    const state = getState();
    const activeWorkspaceID = Session.activeWorkspaceIDSelector(state);

    if (!activeWorkspaceID) return;

    const baseEventInfo: WorkspaceEventInfo = {
      workspaceID: activeWorkspaceID,
    };

    callback({ ...args[0], ...baseEventInfo } as T & WorkspaceEventInfo, dispatch, getState, realtime);
  };

export const createWorkspaceEventPayload = <T extends WorkspaceEventInfo, D extends {}, K extends keyof D>(
  { workspaceID }: T,
  data: D = {} as D,
  { hashed = [], teamhashed = [] }: { hashed?: K[]; teamhashed?: K[] } = {}
) => ({
  hashed,
  teamhashed: ['workspace_id', ...teamhashed] as any as keyof D & keyof K,
  properties: {
    ...data,
    workspace_id: workspaceID,
  },
});

export const createProjectEventTracker =
  <T extends {} | undefined = undefined>(callback: (options: T & ProjectEventInfo, ...args: Parameters<Thunk>) => void) =>
  (...args: T extends undefined ? [] : [T]): SyncThunk =>
  (dispatch, getState, realtime) => {
    const state = getState();
    const versionID = Session.activeVersionIDSelector(state);
    const projectID = Session.activeProjectIDSelector(state);
    const workspaceID = Session.activeWorkspaceIDSelector(state);

    if (!projectID || !versionID || !workspaceID) return;

    const baseEventInfo: ProjectEventInfo = {
      skillID: versionID,
      projectID,
      workspaceID,
    };

    callback({ ...args[0], ...baseEventInfo } as T & ProjectEventInfo, dispatch, getState, realtime);
  };

export const createProjectEventPayload = <T extends ProjectEventInfo, D extends {}, K extends keyof D>(
  { skillID, projectID, workspaceID }: T,
  data: D = {} as D,
  { hashed = [], teamhashed = [] }: { hashed?: K[]; teamhashed?: K[] } = {}
) => ({
  hashed,
  teamhashed: ['workspace_id', ...teamhashed] as any as keyof D & keyof K,
  properties: {
    ...data,
    skill_id: skillID,
    project_id: projectID,
    workspace_id: workspaceID,
  },
});

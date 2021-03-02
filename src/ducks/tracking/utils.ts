import { activeSkillSelector } from '@/ducks/skill/skill/selectors';
// to avoid cycle dependencies
import { activeWorkspaceIDSelector } from '@/ducks/workspace/selectors';
import * as Models from '@/models';
import { SyncThunk, Thunk } from '@/store/types';

import { ProjectEventInfo, WorkspaceEventInfo } from './types';

export const createWorkspaceEventTracker = <T extends {} | undefined = undefined>(
  callback: (options: T & WorkspaceEventInfo, ...args: Parameters<Thunk>) => void
) => (...args: T extends undefined ? [] : [T]): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const activeWorkspaceID = activeWorkspaceIDSelector(state)!;

  const baseEventInfo: WorkspaceEventInfo = {
    workspaceID: activeWorkspaceID,
  };

  callback({ ...args[0], ...baseEventInfo } as T & WorkspaceEventInfo, dispatch, getState);
};

export const createWorkspaceEventPayload = <T extends WorkspaceEventInfo, D extends {}, K extends keyof D>(
  { workspaceID }: T,
  data: D = {} as D,
  { hashed = [], teamhashed = [] }: { hashed?: K[]; teamhashed?: K[] } = {}
) => ({
  hashed,
  teamhashed: (['workspace_id', ...teamhashed] as any) as keyof D & keyof K,
  properties: {
    ...data,
    workspace_id: workspaceID,
  },
});

export const createProjectEventTracker = <T extends {} | undefined = undefined>(
  callback: (options: T & ProjectEventInfo, ...args: Parameters<Thunk>) => void
) => (...args: T extends undefined ? [] : [T]): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const activeSkill = activeSkillSelector(state) as Models.Skill<string>;
  const activeWorkspaceID = activeWorkspaceIDSelector(state)!;

  const baseEventInfo: ProjectEventInfo = {
    skillID: activeSkill.id,
    projectID: activeSkill.projectID,
    workspaceID: activeWorkspaceID,
  };

  callback({ ...args[0], ...baseEventInfo } as T & ProjectEventInfo, dispatch, getState);
};

export const createProjectEventPayload = <T extends ProjectEventInfo, D extends {}, K extends keyof D>(
  { skillID, projectID, workspaceID }: T,
  data: D = {} as D,
  { hashed = [], teamhashed = [] }: { hashed?: K[]; teamhashed?: K[] } = {}
) => ({
  hashed,
  teamhashed: (['workspace_id', ...teamhashed] as any) as keyof D & keyof K,
  properties: {
    ...data,
    skill_id: skillID,
    project_id: projectID,
    workspace_id: workspaceID,
  },
});

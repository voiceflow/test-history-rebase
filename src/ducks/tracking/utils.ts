import * as Skill from '@/ducks/skill';
// to avoid cycle dependencies
import { activeWorkspaceIDSelector } from '@/ducks/workspace/selectors';
import * as Models from '@/models';
import { SyncThunk, Thunk } from '@/store/types';

import { ProjectEventInfo } from './types';

// eslint-disable-next-line import/prefer-default-export
export const createProjectEventTracker = <T extends {} | undefined = undefined>(
  callback: (options: T & ProjectEventInfo, ...args: Parameters<Thunk>) => void
) => (...args: T extends undefined ? [] : [T]): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const activeSkill = Skill.activeSkillSelector(state) as Models.Skill;
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
  hashed: (['skill_id', 'project_id', ...hashed] as any) as keyof D & keyof K,
  teamhashed: (['workspace_id', ...teamhashed] as any) as keyof D & keyof K,
  properties: {
    ...data,
    skill_id: skillID,
    project_id: projectID,
    workspace_id: workspaceID,
  },
});

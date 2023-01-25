import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import * as Errors from '@/config/errors';
import { userIDSelector } from '@/ducks/account/selectors';
import * as Router from '@/ducks/router/actions';
import { waitAsync } from '@/ducks/utils';
import { getActiveWorkspaceContext } from '@/ducks/workspace/utils';
import { Thunk } from '@/store/types';

import { idSelector } from './selectors/active/base';
import { getActiveProjectContext } from './utils';

export const ejectUsersFromProject =
  ({ projectID, creatorID }: Realtime.project.EjectUsersPayload): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const userID = userIDSelector(state);
    const activeProjectID = idSelector(state);

    if (projectID !== activeProjectID) return;

    dispatch(Router.goToDashboard());

    if (creatorID !== userID) {
      toast.info(`Another user has deleted the assistant`);
    }
  };

export const addMember =
  (projectID: string, member: Realtime.ProjectMember): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Realtime.project.member.add({ ...getActiveWorkspaceContext(state), projectID, member }));
  };

export const patchMember =
  (projectID: string, creatorID: number, member: Pick<Realtime.ProjectMember, 'role'>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Realtime.project.member.patch({ ...getActiveWorkspaceContext(state), projectID, creatorID, member }));
  };

export const removeMember =
  (projectID: string, creatorID: number): Thunk =>
  async (dispatch, getState) => {
    const state = getState();

    await dispatch.sync(Realtime.project.member.remove({ ...getActiveWorkspaceContext(state), projectID, creatorID }));
  };

export const patchActivePlatformData =
  (platformData: Record<string, unknown>): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    await dispatch.sync(Realtime.project.patchPlatformData({ ...getActiveProjectContext(state), platformData }));
  };

export const sendFreestyleDisclaimerEmail = (): Thunk => async (dispatch, getState) => {
  const projectID = idSelector(getState());
  Errors.assertProjectID(projectID);

  await dispatch(waitAsync(Realtime.project.sendFreestyleDisclaimerEmail, { ...getActiveProjectContext(getState()) }));
};

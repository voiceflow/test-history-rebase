import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import * as Errors from '@/config/errors';
import { userIDSelector } from '@/ducks/account/selectors';
import * as Router from '@/ducks/router/actions';
import { waitAsync } from '@/ducks/utils';
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
      toast.info(`Another user has deleted the project`);
    }
  };

export const patchPlatformData =
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

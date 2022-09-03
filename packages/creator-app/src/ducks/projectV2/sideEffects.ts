import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import { userIDSelector } from '@/ducks/account/selectors';
import * as Router from '@/ducks/router/actions';
import { Thunk } from '@/store/types';

import { idSelector } from './selectors/active/base';

export const ejectUsersFromProject =
  ({ key: projectID, creatorID }: Realtime.project.EjectUsersPayload): Thunk =>
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

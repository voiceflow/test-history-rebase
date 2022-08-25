import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';

import * as Account from '@/ducks/account';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router/actions';
import { Thunk } from '@/store/types';

export const ejectUsersFromProject =
  ({ key: projectID, creatorID }: Realtime.project.EjectUsersPayload): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const userID = Account.userIDSelector(state);
    const activeProjectID = ProjectV2.active.idSelector(state);

    if (projectID !== activeProjectID) return;

    dispatch(Router.goToDashboard());

    if (creatorID !== userID) {
      toast.info(`Another user has deleted the project`);
    }
  };

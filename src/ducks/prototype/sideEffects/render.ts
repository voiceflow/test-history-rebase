import client from '@/client';
import * as Modal from '@/ducks/modal';
import * as Skill from '@/ducks/skill';
import { Thunk } from '@/store/types';
import { AbortControl, waitJobFinished } from '@/utils/job';

import { log } from '../utils';
import initializePrototype from './initialize';

const MAX_CHECKS = 30;

const renderPrototype = (abortControl: AbortControl): Thunk => async (dispatch, getState) => {
  const projectID = Skill.activeProjectIDSelector(getState());

  if (!projectID) {
    return;
  }

  try {
    await client.platform.alexa.prototype.run(projectID);

    await waitJobFinished({
      fetchJob: () => client.platform.alexa.prototype.getStatus(projectID),
      maxChecks: MAX_CHECKS,
      abortControl,
    });

    if (abortControl.aborted) return;

    dispatch(initializePrototype());
  } catch (err) {
    log.error(err);
    dispatch(Modal.setError('Could Not Render Your Test Project'));
  }
};

export default renderPrototype;

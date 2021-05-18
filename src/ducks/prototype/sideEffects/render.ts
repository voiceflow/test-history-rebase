import client from '@/client';
import * as Errors from '@/config/errors';
import * as Modal from '@/ducks/modal';
import * as Project from '@/ducks/project';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';
import { AbortControl, waitJobFinished } from '@/utils/job';
import * as Sentry from '@/vendors/sentry';

import resetPrototype from './reset';

const MAX_CHECKS = 30;

const renderPrototype = (abortControl: AbortControl): Thunk => async (dispatch, getState) => {
  const state = getState();
  const platform = Project.activePlatformSelector(state);
  const projectID = Session.activeProjectIDSelector(state);
  const versionID = Session.activeVersionIDSelector(state);

  Errors.assertProjectID(projectID);
  Errors.assertVersionID(versionID);

  try {
    const platformPrototypeService = client.platform(platform).prototype;

    await platformPrototypeService.run(projectID);

    await waitJobFinished({
      fetchJob: () => platformPrototypeService.getStatus(projectID),
      maxChecks: MAX_CHECKS,
      abortControl,
    });

    if (abortControl.aborted) return;

    const prototype = await client.api.version.getPrototype(versionID);

    if (!prototype) throw new Error('version prototype not found');

    dispatch(resetPrototype());
  } catch (err) {
    Sentry.error(err);
    dispatch(Modal.setError('Could Not Render Your Test Project'));
  }
};

export default renderPrototype;

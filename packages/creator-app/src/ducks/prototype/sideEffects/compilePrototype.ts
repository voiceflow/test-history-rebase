import client from '@/client';
import * as Errors from '@/config/errors';
import * as Modal from '@/ducks/modal';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';
import { AbortControl, waitJobFinished } from '@/utils/job';
import * as Sentry from '@/vendors/sentry';

import resetPrototype from './reset';

const MAX_CHECKS = 30;

const compilePrototype =
  (abortControl: AbortControl = { aborted: false }): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const platform = ProjectV2.active.platformSelector(state);
    const projectID = Session.activeProjectIDSelector(state);
    const versionID = Session.activeVersionIDSelector(state);
    const diagramID = Session.activeDiagramIDSelector(state);

    Errors.assertProjectID(projectID);
    Errors.assertVersionID(versionID);

    const platformPrototypeService = client.platform(platform).prototype;

    try {
      await platformPrototypeService.run(projectID, diagramID);

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
      platformPrototypeService.cancel(projectID);
      Sentry.error(err);
      dispatch(Modal.setError('Could Not Render Your Test Project'));
    }
  };

export default compilePrototype;

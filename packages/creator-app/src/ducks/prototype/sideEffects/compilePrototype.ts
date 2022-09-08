import client from '@/client';
import * as Errors from '@/config/errors';
import { PrototypeRenderSyncOptions } from '@/constants/prototype';
import * as Modal from '@/ducks/modal';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { Thunk } from '@/store/types';
import * as Sentry from '@/vendors/sentry';

const compilePrototype =
  (compilerOptions?: PrototypeRenderSyncOptions): Thunk =>
  async (dispatch, getState) => {
    const state = getState();
    const platform = ProjectV2.active.platformSelector(state);
    const projectID = Session.activeProjectIDSelector(state);
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertProjectID(projectID);
    Errors.assertVersionID(versionID);

    const platformPrototypeService = client.platform(platform).prototype;

    try {
      await platformPrototypeService.renderSync(versionID, compilerOptions);
    } catch (err) {
      Sentry.error(err);
      dispatch(Modal.setError('Could Not Render Your Test Project'));
    }
  };

export default compilePrototype;

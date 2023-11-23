import { datadogRum } from '@datadog/browser-rum';
import { LOGROCKET_ENABLED } from '@ui/config';
import LogRocket from 'logrocket';

import client from '@/client';
import * as Errors from '@/config/errors';
import { PrototypeRenderSyncOptions } from '@/constants/prototype';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { openError } from '@/ModalsV2/utils';
import { Thunk } from '@/store/types';

const compilePrototype =
  (compilerOptions?: PrototypeRenderSyncOptions): Thunk =>
  async (_, getState) => {
    const state = getState();
    const platform = ProjectV2.active.platformSelector(state);
    const projectID = Session.activeProjectIDSelector(state);
    const versionID = Session.activeVersionIDSelector(state);

    Errors.assertProjectID(projectID);
    Errors.assertVersionID(versionID);

    const platformPrototypeService = client.platform(platform).prototype;

    try {
      await platformPrototypeService.renderSync(versionID, compilerOptions);
    } catch (error) {
      if (LOGROCKET_ENABLED) {
        LogRocket.error(error);
      } else {
        datadogRum.addError(error);
      }
      return openError({ error: 'Could Not Render Your Test Assistant' });
    }
  };

export default compilePrototype;

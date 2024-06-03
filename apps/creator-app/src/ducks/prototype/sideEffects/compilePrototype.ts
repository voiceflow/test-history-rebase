import { datadogRum } from '@datadog/browser-rum';

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
    } catch (err) {
      datadogRum.addError(err);
      await openError({ error: 'Could Not Render Your Test Agent' });
    }
  };

export default compilePrototype;

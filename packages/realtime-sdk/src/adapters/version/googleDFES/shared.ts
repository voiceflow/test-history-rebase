import { Version } from '@realtime-sdk/models';
import { DFESVersion } from '@voiceflow/google-dfes-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';

import baseVersionAdapter from '../base';

type SharedDBVersion = Omit<DFESVersion.Version, 'variables' | 'platformData'>;
type SharedVersion = Omit<Version<DFESVersion.PlatformData>, 'settings' | 'variables' | 'publishing'>;

const sharedVersionAdapter = createAdapter<SharedDBVersion, SharedVersion>(
  (baseVersion) => ({
    ...baseVersionAdapter.fromDB(baseVersion),

    status: null,
    session: null,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default sharedVersionAdapter;

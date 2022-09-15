import { Version } from '@realtime-sdk/models';
import { DFESVersion } from '@voiceflow/google-dfes-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import baseVersionAdapter from '../base';

type SharedDBVersion = Omit<DFESVersion.Version, 'variables' | 'platformData'>;
type SharedVersion = Omit<Version<DFESVersion.PlatformData>, 'settings' | 'variables' | 'publishing'>;

const sharedVersionAdapter = createMultiAdapter<SharedDBVersion, SharedVersion>(
  (baseVersion) => ({
    ...baseVersionAdapter.fromDB(baseVersion),

    status: null,
    session: null,
  }),
  notImplementedAdapter.transformer
);
export default sharedVersionAdapter;

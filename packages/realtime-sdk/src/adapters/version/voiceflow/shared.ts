import { Version } from '@realtime-sdk/models';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';

import baseVersionAdapter from '../base';

type SharedDBVersion = Omit<VoiceflowVersion.Version, 'variables' | 'platformData'>;
type SharedVersion = Omit<Version<VoiceflowVersion.PlatformData & { status?: never }>, 'settings' | 'variables' | 'publishing'>;

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

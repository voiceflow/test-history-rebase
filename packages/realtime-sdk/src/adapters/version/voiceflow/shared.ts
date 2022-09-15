import { Version } from '@realtime-sdk/models';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';

import baseVersionAdapter from '../base';

type SharedDBVersion = Omit<VoiceflowVersion.Version, 'variables' | 'platformData'>;
type SharedVersion = Omit<Version<VoiceflowVersion.PlatformData & { status?: never }>, 'settings' | 'variables' | 'publishing'>;

const sharedVersionAdapter = createMultiAdapter<SharedDBVersion, SharedVersion>(
  (baseVersion) => ({
    ...baseVersionAdapter.fromDB(baseVersion),

    status: null,
    session: null,
  }),
  notImplementedAdapter.transformer
);
export default sharedVersionAdapter;

import { Version } from '@realtime-sdk/models';
import { getPlatformGlobalVariables } from '@realtime-sdk/utils/globalVariables';
import * as Platform from '@voiceflow/platform-config';
import { VoiceflowVersion } from '@voiceflow/voiceflow-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import sharedVersionAdapter from './shared';

const voiceVersionAdapter = createMultiAdapter<VoiceflowVersion.VoiceVersion, Version<VoiceflowVersion.VoicePlatformData & { status?: never }>>(
  ({
    variables,
    platformData: {
      settings: { session, ...settings },
      publishing,
    },
    ...baseVersion
  }) => ({
    ...sharedVersionAdapter.fromDB(baseVersion),

    settings: _omit(VoiceflowVersion.defaultVoiceSettings(settings), 'session'),
    variables: variables.filter((variable) => !getPlatformGlobalVariables(Platform.Constants.PlatformType.VOICEFLOW).includes(variable)),
    publishing,
  }),
  notImplementedAdapter.transformer
);
export default voiceVersionAdapter;

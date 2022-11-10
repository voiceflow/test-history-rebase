import { Version } from '@realtime-sdk/models';
import { getPlatformGlobalVariables } from '@realtime-sdk/utils/globalVariables';
import { DFESVersion } from '@voiceflow/google-dfes-types';
import * as Platform from '@voiceflow/platform-config';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import sharedVersionAdapter from './shared';

const voiceVersionAdapter = createMultiAdapter<DFESVersion.VoiceVersion, Version<DFESVersion.VoicePlatformData>>(
  ({
    variables,
    platformData: {
      settings: { session, ...settings },
      publishing,
    },
    ...baseVersion
  }) => ({
    ...sharedVersionAdapter.fromDB(baseVersion),

    settings: _omit(DFESVersion.defaultVoiceSettings(settings), ['session']),
    variables: variables.filter((variable) => !getPlatformGlobalVariables(Platform.Constants.PlatformType.VOICEFLOW).includes(variable)),
    publishing,
  }),
  notImplementedAdapter.transformer
);
export default voiceVersionAdapter;

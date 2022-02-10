import { Version } from '@realtime-sdk/models';
import { getPlatformGlobalVariables } from '@realtime-sdk/utils/globalVariables';
import { DFESVersion } from '@voiceflow/google-dfes-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import sharedVersionAdapter from './shared';

const voiceVersionAdapter = createAdapter<DFESVersion.VoiceVersion, Version<DFESVersion.VoicePlatformData>>(
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
    variables: variables.filter((variable) => !getPlatformGlobalVariables(VoiceflowConstants.PlatformType.GENERAL).includes(variable)),
    publishing,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default voiceVersionAdapter;

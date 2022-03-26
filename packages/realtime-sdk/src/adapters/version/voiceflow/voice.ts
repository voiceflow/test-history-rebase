import { Version } from '@realtime-sdk/models';
import { getPlatformGlobalVariables } from '@realtime-sdk/utils/globalVariables';
import { VoiceflowConstants, VoiceflowVersion } from '@voiceflow/voiceflow-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import sharedVersionAdapter from './shared';

const voiceVersionAdapter = createAdapter<VoiceflowVersion.VoiceVersion, Version<VoiceflowVersion.VoicePlatformData & { status?: never }>>(
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
    variables: variables.filter((variable) => !getPlatformGlobalVariables(VoiceflowConstants.PlatformType.VOICEFLOW).includes(variable)),
    publishing,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default voiceVersionAdapter;

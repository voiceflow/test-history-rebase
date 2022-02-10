import { Version } from '@realtime-sdk/models';
import { getPlatformGlobalVariables } from '@realtime-sdk/utils/globalVariables';
import { DFESVersion } from '@voiceflow/google-dfes-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import sharedVersionAdapter from './shared';

const chatVersionAdapter = createAdapter<DFESVersion.ChatVersion, Version<DFESVersion.ChatPlatformData>>(
  ({
    variables,
    platformData: {
      settings: { session, ...settings },
      publishing,
    },
    ...sharedVersion
  }) => ({
    ...sharedVersionAdapter.fromDB(sharedVersion),

    settings: _omit(DFESVersion.defaultChatSettings(settings), 'session'),
    variables: variables.filter((variable) => !getPlatformGlobalVariables(VoiceflowConstants.PlatformType.GENERAL).includes(variable)),
    publishing,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default chatVersionAdapter;

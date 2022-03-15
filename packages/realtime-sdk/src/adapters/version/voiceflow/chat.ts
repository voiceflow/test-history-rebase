import { Version } from '@realtime-sdk/models';
import { getPlatformGlobalVariables } from '@realtime-sdk/utils/globalVariables';
import { VoiceflowConstants, VoiceflowVersion } from '@voiceflow/voiceflow-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import sharedVersionAdapter from './shared';

const chatVersionAdapter = createAdapter<VoiceflowVersion.ChatVersion, Version<VoiceflowVersion.ChatPlatformData & { status?: any }>>(
  ({
    variables,
    platformData: {
      settings: { session, ...settings },
      publishing,
    },
    ...sharedVersion
  }) => ({
    ...sharedVersionAdapter.fromDB(sharedVersion),

    settings: _omit(VoiceflowVersion.defaultChatSettings(settings), 'session'),
    variables: variables.filter((variable) => !getPlatformGlobalVariables(VoiceflowConstants.PlatformType.VOICEFLOW).includes(variable)),
    publishing,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default chatVersionAdapter;

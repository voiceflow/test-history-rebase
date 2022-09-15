import { Version } from '@realtime-sdk/models';
import { getPlatformGlobalVariables } from '@realtime-sdk/utils/globalVariables';
import { AlexaConstants, AlexaVersion } from '@voiceflow/alexa-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import baseVersionAdapter from '../base';
import createSessionAdapter from '../session';

const sessionAdapter = createSessionAdapter<AlexaConstants.Voice>({ platform: VoiceflowConstants.PlatformType.ALEXA });

const alexaVersionAdapter = createMultiAdapter<AlexaVersion.Version, Version<AlexaVersion.PlatformData>>(
  ({
    variables,
    platformData: {
      status,
      settings: { session, ...settings },
      publishing,
    },
    ...baseVersion
  }) => ({
    ...baseVersionAdapter.fromDB(baseVersion),

    status,
    session: sessionAdapter.fromDB(session, { defaultVoice: settings.defaultVoice }),
    settings: _omit(AlexaVersion.defaultSettings(settings), 'session'),
    variables: variables.filter((variable) => !getPlatformGlobalVariables(VoiceflowConstants.PlatformType.ALEXA).includes(variable)),
    publishing: AlexaVersion.defaultPublishing(publishing),
  }),
  notImplementedAdapter.transformer
);

export default alexaVersionAdapter;

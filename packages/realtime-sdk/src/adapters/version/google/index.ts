import { Version } from '@realtime-sdk/models';
import { getPlatformGlobalVariables } from '@realtime-sdk/utils/globalVariables';
import { GoogleVersion } from '@voiceflow/google-types';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { createMultiAdapter, notImplementedAdapter } from 'bidirectional-adapter';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import baseVersionAdapter from '../base';
import createSessionAdapter from '../session';
import localesAdapter from './locales';

const sessionAdapter = createSessionAdapter({ platform: VoiceflowConstants.PlatformType.GOOGLE });

const googleVersionAdapter = createMultiAdapter<GoogleVersion.VoiceVersion, Version<GoogleVersion.VoicePlatformData>>(
  ({
    variables,
    platformData: {
      settings: { session, ...settings },
      publishing,
    },
    ...baseVersion
  }) => ({
    ...baseVersionAdapter.fromDB(baseVersion),

    status: null,
    session: sessionAdapter.fromDB(session, { defaultVoice: settings.defaultVoice }),
    settings: _omit(GoogleVersion.defaultVoiceSettings(settings), 'session'),
    variables: variables.filter((variable) => !getPlatformGlobalVariables(VoiceflowConstants.PlatformType.GOOGLE).includes(variable)),
    publishing: { ...GoogleVersion.defaultVoicePublishing(publishing), locales: localesAdapter(publishing?.locales) },
  }),
  notImplementedAdapter.transformer
);
export default googleVersionAdapter;

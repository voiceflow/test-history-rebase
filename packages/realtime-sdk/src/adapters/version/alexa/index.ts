import { Constants as AlexaConstants, Version as AlexaVersion } from '@voiceflow/alexa-types';
import { Constants } from '@voiceflow/general-types';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import { Version } from '../../../models';
import { getPlatformGlobalVariables } from '../../../utils/globalVariables';
import { AdapterNotImplementedError, createAdapter } from '../../utils';
import baseVersionAdapter from '../base';
import createSessionAdapter from '../session';

const sessionAdapter = createSessionAdapter<AlexaConstants.Voice>({ platform: Constants.PlatformType.ALEXA });

const alexaVersionAdapter = createAdapter<AlexaVersion.AlexaVersion, Version<AlexaVersion.AlexaVersionData>>(
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
    settings: _omit(AlexaVersion.defaultAlexaVersionSettings(settings), 'session'),
    variables: variables.filter((variable) => !getPlatformGlobalVariables(Constants.PlatformType.ALEXA).includes(variable)),
    publishing: AlexaVersion.defaultAlexaVersionPublishing(publishing),
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default alexaVersionAdapter;

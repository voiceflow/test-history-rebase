import { Constants } from '@voiceflow/general-types';
import { Version as GoogleVersion } from '@voiceflow/google-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import { Version } from '../../../models';
import { getPlatformGlobalVariables } from '../../../utils/globalVariables';
import baseVersionAdapter from '../base';
import createSessionAdapter from '../session';
import localesAdapter from './locales';

const sessionAdapter = createSessionAdapter({ platform: Constants.PlatformType.GOOGLE });

const googleVersionAdapter = createAdapter<GoogleVersion.GoogleVersion, Version<GoogleVersion.GoogleVersionData>>(
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
    settings: _omit(GoogleVersion.defaultGoogleVersionSettings(settings), 'session'),
    variables: variables.filter((variable) => !getPlatformGlobalVariables(Constants.PlatformType.GOOGLE).includes(variable)),
    publishing: { ...GoogleVersion.defaultGoogleVersionPublishing(publishing), locales: localesAdapter(publishing?.locales) },
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default googleVersionAdapter;

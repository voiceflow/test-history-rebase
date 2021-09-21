import { Constants } from '@voiceflow/general-types';
import { Version as GoogleVersion } from '@voiceflow/google-types';
import { Adapters } from '@voiceflow/realtime-sdk';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import { Version } from '@/models';
import { getPlatformGlobalVariables } from '@/utils/globalVariables';

import createSessionAdapter from '../session';
import localesAdapter from './locales';

const sessionAdapter = createSessionAdapter({ platform: Constants.PlatformType.GOOGLE });

const googleVersionAdapter = Adapters.createAdapter<GoogleVersion.GoogleVersion, Version<GoogleVersion.GoogleVersionData>>(
  ({
    _id,
    creatorID,
    projectID,
    rootDiagramID,
    variables,
    platformData: {
      settings: { session, ...settings },
      publishing,
    },
  }) => ({
    id: _id,
    creatorID,
    projectID,
    rootDiagramID,
    variables: variables.filter((variable) => !getPlatformGlobalVariables(Constants.PlatformType.GOOGLE).includes(variable)),
    session: sessionAdapter.fromDB(session, { defaultVoice: settings.defaultVoice }),
    settings: _omit(GoogleVersion.defaultGoogleVersionSettings(settings), 'session'),
    publishing: { ...GoogleVersion.defaultGoogleVersionPublishing(publishing), locales: localesAdapter(publishing?.locales) },
    status: null,
  }),
  () => {
    throw new Adapters.AdapterNotImplementedError();
  }
);
export default googleVersionAdapter;

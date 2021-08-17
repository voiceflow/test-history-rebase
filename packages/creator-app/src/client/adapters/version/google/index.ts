import { Version as GoogleVersion } from '@voiceflow/google-types';
import { PlatformType } from '@voiceflow/internal';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { Version } from '@/models';
import { getPlatformGlobalVariables } from '@/utils/globalVariables';

import createSessionAdapter from '../session';
import localesAdapter from './locales';

const sessionAdapter = createSessionAdapter({ platform: PlatformType.GOOGLE });

const googleVersionAdapter = createAdapter<GoogleVersion.GoogleVersion, Version<GoogleVersion.GoogleVersionData>>(
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
    variables: variables.filter((variable) => !getPlatformGlobalVariables(PlatformType.GOOGLE).includes(variable)),
    session: sessionAdapter.fromDB(session, { defaultVoice: settings.defaultVoice }),
    settings: _omit(GoogleVersion.defaultGoogleVersionSettings(settings), 'session'),
    publishing: { ...GoogleVersion.defaultGoogleVersionPublishing(publishing), locales: localesAdapter(publishing?.locales) },
    status: null,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default googleVersionAdapter;

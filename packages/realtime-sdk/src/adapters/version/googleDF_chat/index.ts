import { Version } from '@realtime-sdk/models';
import { getPlatformGlobalVariables } from '@realtime-sdk/utils/globalVariables';
import { Constants } from '@voiceflow/general-types';
import { Version as GoogleDFVersion } from '@voiceflow/google-dfes-types';
import createAdapter, { AdapterNotImplementedError } from 'bidirectional-adapter';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import baseVersionAdapter from '../base';

const googleDFChatVersionAdapter = createAdapter<GoogleDFVersion.GoogleDFESVersion, Version<GoogleDFVersion.GoogleDFESVersionData>>(
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
    session: null,
    settings: _omit(GoogleDFVersion.defaultGoogleDFESVersionSettings(settings), 'session'),
    variables: variables.filter((variable) => !getPlatformGlobalVariables(Constants.PlatformType.GENERAL).includes(variable)),
    publishing,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default googleDFChatVersionAdapter;

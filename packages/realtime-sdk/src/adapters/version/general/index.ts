import { Constants, Version as GeneralVersion } from '@voiceflow/general-types';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import { Version } from '../../../models';
import { getPlatformGlobalVariables } from '../../../utils/globalVariables';
import { AdapterNotImplementedError, createAdapter } from '../../utils';
import baseVersionAdapter from '../base';

const generalVersionAdapter = createAdapter<GeneralVersion.GeneralVersion, Version<GeneralVersion.GeneralVersionData>>(
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
    settings: _omit(GeneralVersion.defaultGeneralVersionSettings(settings), 'session'),
    variables: variables.filter((variable) => !getPlatformGlobalVariables(Constants.PlatformType.GENERAL).includes(variable)),
    publishing,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default generalVersionAdapter;

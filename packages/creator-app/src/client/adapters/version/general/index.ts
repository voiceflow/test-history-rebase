import { Constants, Version as GeneralVersion } from '@voiceflow/general-types';
import { Adapters } from '@voiceflow/realtime-sdk';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import { Version } from '@/models';
import { getPlatformGlobalVariables } from '@/utils/globalVariables';

const generalVersionAdapter = Adapters.createAdapter<GeneralVersion.GeneralVersion, Version<GeneralVersion.GeneralVersionData>>(
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
    variables: variables.filter((variable) => !getPlatformGlobalVariables(Constants.PlatformType.GENERAL).includes(variable)),
    session: null,
    settings: _omit(GeneralVersion.defaultGeneralVersionSettings(settings), 'session'),
    publishing,
    status: null,
  }),
  () => {
    throw new Adapters.AdapterNotImplementedError();
  }
);
export default generalVersionAdapter;

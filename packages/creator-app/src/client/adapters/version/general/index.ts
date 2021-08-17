import { Version as GeneralVersion } from '@voiceflow/general-types';
import { PlatformType } from '@voiceflow/internal';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { Version } from '@/models';
import { getPlatformGlobalVariables } from '@/utils/globalVariables';

const generalVersionAdapter = createAdapter<GeneralVersion.GeneralVersion, Version<GeneralVersion.GeneralVersionData>>(
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
    variables: variables.filter((variable) => !getPlatformGlobalVariables(PlatformType.GENERAL).includes(variable)),
    session: null,
    settings: _omit(GeneralVersion.defaultGeneralVersionSettings(settings), 'session'),
    publishing,
    status: null,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default generalVersionAdapter;

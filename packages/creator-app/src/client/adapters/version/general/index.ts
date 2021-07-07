import { defaultGeneralVersionSettings, GeneralVersion, GeneralVersionData } from '@voiceflow/general-types';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { BUILT_IN_VARIABLES } from '@/constants';
import { Version } from '@/models';

const generalVersionAdapter = createAdapter<GeneralVersion, Version<GeneralVersionData>>(
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
    variables: variables.filter((variable) => !BUILT_IN_VARIABLES.includes(variable)),
    session: null,
    settings: _omit(defaultGeneralVersionSettings(settings), 'session'),
    publishing,
    status: null,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default generalVersionAdapter;

import { AlexaVersion, AlexaVersionData, defaultAlexaVersionPublishing, defaultAlexaVersionSettings, Voice } from '@voiceflow/alexa-types';
import { PlatformType } from '@voiceflow/internal';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { BUILT_IN_VARIABLES } from '@/constants';
import { Version } from '@/models';

import createSessionAdapter from '../session';

const sessionAdapter = createSessionAdapter<Voice>({ platform: PlatformType.ALEXA });

const alexaVersionAdapter = createAdapter<AlexaVersion, Version<AlexaVersionData>>(
  ({
    _id,
    creatorID,
    projectID,
    rootDiagramID,
    variables,
    platformData: {
      settings: { session, ...settings },
      publishing,
      status,
    },
  }) => ({
    id: _id,
    creatorID,
    projectID,
    rootDiagramID,
    variables: variables.filter((variable) => !BUILT_IN_VARIABLES.includes(variable)),
    session: sessionAdapter.fromDB(session, { defaultVoice: settings.defaultVoice }),
    settings: _omit(defaultAlexaVersionSettings(settings), 'session'),
    publishing: defaultAlexaVersionPublishing(publishing),
    status,
  }),
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default alexaVersionAdapter;

import { Constants, Version as AlexaVersion } from '@voiceflow/alexa-types';
import { PlatformType } from '@voiceflow/internal';
import { Adapters } from '@voiceflow/realtime-sdk';
// eslint-disable-next-line you-dont-need-lodash-underscore/omit
import _omit from 'lodash/omit';

import { Version } from '@/models';
import { getPlatformGlobalVariables } from '@/utils/globalVariables';

import createSessionAdapter from '../session';

const sessionAdapter = createSessionAdapter<Constants.Voice>({ platform: PlatformType.ALEXA });

const alexaVersionAdapter = Adapters.createAdapter<AlexaVersion.AlexaVersion, Version<AlexaVersion.AlexaVersionData>>(
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
    variables: variables.filter((variable) => !getPlatformGlobalVariables(PlatformType.ALEXA).includes(variable)),
    session: sessionAdapter.fromDB(session, { defaultVoice: settings.defaultVoice }),
    settings: _omit(AlexaVersion.defaultAlexaVersionSettings(settings), 'session'),
    publishing: AlexaVersion.defaultAlexaVersionPublishing(publishing),
    status,
  }),
  () => {
    throw new Adapters.AdapterNotImplementedError();
  }
);

export default alexaVersionAdapter;

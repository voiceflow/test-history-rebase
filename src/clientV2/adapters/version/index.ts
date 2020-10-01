import { AlexaVersion } from '@voiceflow/alexa-types';
import { Version, VersionPlatformData } from '@voiceflow/api-sdk';
import { GoogleVersion } from '@voiceflow/google-types';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { PlatformType } from '@/constants';
import { Skill } from '@/models';

import alexaVersionAdapter from './alexa';
import googleVersionAdapter from './google';

const versionAdapter = createAdapter<Version<VersionPlatformData>, Skill, [{ platform: PlatformType }]>(
  (version, { platform = PlatformType.ALEXA }) => {
    if (platform === PlatformType.ALEXA) {
      return alexaVersionAdapter.fromDB(version as AlexaVersion);
    }
    if (platform === PlatformType.GOOGLE) {
      return googleVersionAdapter.fromDB(version as GoogleVersion);
    }
    throw new Error('Invalid Platform');
  },
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default versionAdapter;

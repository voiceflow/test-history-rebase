import { AlexaVersion } from '@voiceflow/alexa-types';
import { Version, VersionPlatformData } from '@voiceflow/api-sdk';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { PlatformType } from '@/constants';
import { Skill } from '@/models';

import alexaVersionAdapter from './alexa';

const versionAdapter = createAdapter<Version<VersionPlatformData>, Skill, [{ platform: PlatformType }]>(
  (version, { platform = PlatformType.ALEXA }) => {
    if (platform === PlatformType.ALEXA) {
      return alexaVersionAdapter.fromDB(version as AlexaVersion);
    }
    if (platform === PlatformType.GOOGLE) {
      // TODO: google project adapter
      throw new AdapterNotImplementedError();
    }
    throw new Error('Invalid Platform');
  },
  () => {
    throw new AdapterNotImplementedError();
  }
);

export default versionAdapter;

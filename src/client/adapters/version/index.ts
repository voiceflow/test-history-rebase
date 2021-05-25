import { AlexaVersion, AlexaVersionData } from '@voiceflow/alexa-types';
import { GeneralVersion, GeneralVersionData } from '@voiceflow/general-types';
import { GoogleVersion, GoogleVersionData } from '@voiceflow/google-types';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { PlatformType } from '@/constants';
import { Version } from '@/models';

import alexaVersionAdapter from './alexa';
import generalVersionAdapter from './general';
import googleVersionAdapter from './google';

export type AnyDBVersion = AlexaVersion | GeneralVersion | GoogleVersion;
type AnyVersion = Version<AlexaVersionData> | Version<GeneralVersionData> | Version<GoogleVersionData>;

const versionAdapter = createAdapter<AnyDBVersion, AnyVersion, [{ platform: PlatformType }]>(
  (version, { platform = PlatformType.ALEXA }) => {
    switch (platform) {
      case PlatformType.ALEXA:
        return alexaVersionAdapter.fromDB(version as AlexaVersion);
      case PlatformType.GOOGLE:
        return googleVersionAdapter.fromDB(version as GoogleVersion);
      case PlatformType.GENERAL:
      default:
        return generalVersionAdapter.fromDB(version as GeneralVersion);
    }
  },
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default versionAdapter;

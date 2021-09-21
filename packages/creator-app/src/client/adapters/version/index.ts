import { Version as AlexaVersion } from '@voiceflow/alexa-types';
import { Constants, Version as GeneralVersion } from '@voiceflow/general-types';
import { Version as GoogleVersion } from '@voiceflow/google-types';
import { Adapters } from '@voiceflow/realtime-sdk';

import { Version } from '@/models';

import alexaVersionAdapter from './alexa';
import generalVersionAdapter from './general';
import googleVersionAdapter from './google';

export type AnyDBVersion = AlexaVersion.AlexaVersion | GeneralVersion.GeneralVersion | GoogleVersion.GoogleVersion;

type AnyVersion = Version<AlexaVersion.AlexaVersionData> | Version<GeneralVersion.GeneralVersionData> | Version<GoogleVersion.GoogleVersionData>;

const versionAdapter = Adapters.createAdapter<AnyDBVersion, AnyVersion, [{ platform: Constants.PlatformType }]>(
  (version, { platform = Constants.PlatformType.ALEXA }) => {
    switch (platform) {
      case Constants.PlatformType.ALEXA:
        return alexaVersionAdapter.fromDB(version as AlexaVersion.AlexaVersion);
      case Constants.PlatformType.GOOGLE:
        return googleVersionAdapter.fromDB(version as GoogleVersion.GoogleVersion);
      case Constants.PlatformType.GENERAL:
      default:
        return generalVersionAdapter.fromDB(version as GeneralVersion.GeneralVersion);
    }
  },
  () => {
    throw new Adapters.AdapterNotImplementedError();
  }
);
export default versionAdapter;

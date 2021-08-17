import { Version as AlexaVersion } from '@voiceflow/alexa-types';
import { Version as GeneralVersion } from '@voiceflow/general-types';
import { Version as GoogleVersion } from '@voiceflow/google-types';
import { PlatformType } from '@voiceflow/internal';

import { AdapterNotImplementedError, createAdapter } from '@/client/adapters/utils';
import { Version } from '@/models';

import alexaVersionAdapter from './alexa';
import generalVersionAdapter from './general';
import googleVersionAdapter from './google';

export type AnyDBVersion = AlexaVersion.AlexaVersion | GeneralVersion.GeneralVersion | GoogleVersion.GoogleVersion;

type AnyVersion = Version<AlexaVersion.AlexaVersionData> | Version<GeneralVersion.GeneralVersionData> | Version<GoogleVersion.GoogleVersionData>;

const versionAdapter = createAdapter<AnyDBVersion, AnyVersion, [{ platform: PlatformType }]>(
  (version, { platform = PlatformType.ALEXA }) => {
    switch (platform) {
      case PlatformType.ALEXA:
        return alexaVersionAdapter.fromDB(version as AlexaVersion.AlexaVersion);
      case PlatformType.GOOGLE:
        return googleVersionAdapter.fromDB(version as GoogleVersion.GoogleVersion);
      case PlatformType.GENERAL:
      default:
        return generalVersionAdapter.fromDB(version as GeneralVersion.GeneralVersion);
    }
  },
  () => {
    throw new AdapterNotImplementedError();
  }
);
export default versionAdapter;

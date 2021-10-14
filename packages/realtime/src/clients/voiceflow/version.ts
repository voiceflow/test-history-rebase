import { Version as AlexaVersion } from '@voiceflow/alexa-types';
import { Constants, Version as GeneralVersion } from '@voiceflow/general-types';
import { Version as GoogleVersion } from '@voiceflow/google-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { AxiosInstance } from 'axios';

import { ExtraOptions } from './types';

export interface VersionPlatformClient<S extends Realtime.AnyVersionSettings, P> {
  patchSettings: (versionID: string, settings: Partial<S>) => Promise<void>;

  patchPublishing: (versionID: string, publishing: Partial<P>) => Promise<void>;
}

export type GenericVersionPlatformClient = VersionPlatformClient<Realtime.AnyVersionSettings, any>;

const PlatformClient = <S extends Realtime.AnyVersionSettings, P>(axios: AxiosInstance): VersionPlatformClient<S, P> => ({
  patchSettings: (versionID, settings) => axios.patch(`/version/${versionID}/settings`, settings),

  patchPublishing: (versionID, publishing) => axios.patch(`/version/${versionID}/publishing`, publishing),
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Client = ({ api, alexa, google, general }: ExtraOptions) => {
  const alexaClient = PlatformClient<AlexaVersion.AlexaVersionSettings, AlexaVersion.AlexaVersionPublishing>(alexa);
  const googleClient = PlatformClient<GoogleVersion.GoogleVersionSettings, GoogleVersion.GoogleVersionPublishing>(google);
  const generalClient = PlatformClient<GeneralVersion.GeneralVersionSettings, never>(general);

  const getPlatform = Realtime.Utils.platform.createPlatformSelector(
    {
      [Constants.PlatformType.ALEXA]: alexaClient as GenericVersionPlatformClient,
      [Constants.PlatformType.GOOGLE]: googleClient as GenericVersionPlatformClient,
    },
    generalClient as GenericVersionPlatformClient
  );

  return {
    canRead: (creatorID: number, versionID: string) =>
      api
        .head(`/v2/user/${creatorID}/versions/${versionID}`)
        .then(() => true)
        .catch(() => false),

    platform: Object.assign(getPlatform, {
      alexa: alexaClient,
      google: googleClient,
      general: generalClient,
    }),
  };
};

export default Client;

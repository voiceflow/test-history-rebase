import * as Alexa from '@voiceflow/alexa-types';
import { Nullish } from '@voiceflow/common';
import * as General from '@voiceflow/general-types';
import * as Dialogflow from '@voiceflow/google-dfes-types';
import * as Google from '@voiceflow/google-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { AxiosInstance } from 'axios';

import { ExtraOptions } from './types';

interface VersionClient {
  canRead: (creatorID: number, versionID: string) => Promise<boolean>;
  platform: (platform?: Nullish<General.Constants.PlatformType>) => any;
}

export interface VersionPlatformClient<S extends Realtime.AnyVersionSettings, P> {
  patchSettings: (versionID: string, settings: Partial<S>) => Promise<void>;

  patchPublishing: (versionID: string, publishing: Partial<P>) => Promise<void>;
}

export type GenericVersionPlatformClient = VersionPlatformClient<Realtime.AnyVersionSettings, any>;

const PlatformClient = <S extends Realtime.AnyVersionSettings, P>(axios: AxiosInstance): VersionPlatformClient<S, P> => ({
  patchSettings: (versionID, settings) => axios.patch(`/version/${versionID}/settings`, settings),

  patchPublishing: (versionID, publishing) => axios.patch(`/version/${versionID}/publishing`, publishing),
});

const Client = ({ api, alexa, google, dialogflow, general }: ExtraOptions): VersionClient => {
  const alexaClient = PlatformClient<Alexa.Version.AlexaVersionSettings, Alexa.Version.AlexaVersionPublishing>(alexa);
  const googleClient = PlatformClient<Google.Version.GoogleVersionSettings, Google.Version.GoogleVersionPublishing>(google);
  const dialogflowClient = PlatformClient<Dialogflow.Version.GoogleDFESVersionSettings, Dialogflow.Version.GoogleDFESVersionPublishing>(dialogflow);
  const generalClient = PlatformClient<General.Version.GeneralVersionSettings, never>(general);

  const getPlatform = Realtime.Utils.platform.createPlatformSelector(
    {
      [General.Constants.PlatformType.ALEXA]: alexaClient as GenericVersionPlatformClient,
      [General.Constants.PlatformType.GOOGLE]: googleClient as GenericVersionPlatformClient,
      [General.Constants.PlatformType.DIALOGFLOW_ES_CHAT]: dialogflowClient as GenericVersionPlatformClient,
      [General.Constants.PlatformType.DIALOGFLOW_ES_VOICE]: dialogflowClient as GenericVersionPlatformClient,
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
      dialogflow: dialogflowClient,
      general: generalClient,
    }),
  };
};

export default Client;

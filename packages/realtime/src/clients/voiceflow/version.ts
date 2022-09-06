import { AlexaVersion } from '@voiceflow/alexa-types';
import { DFESVersion } from '@voiceflow/google-dfes-types';
import { GoogleVersion } from '@voiceflow/google-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants, VoiceflowVersion } from '@voiceflow/voiceflow-types';
import { AxiosInstance } from 'axios';

import { ExtraOptions } from './types';
import createResourceClient from './utils/resource';

export interface VersionPlatformClient<S extends Realtime.AnyVersionSettings, P> {
  patchSettings: (versionID: string, settings: Partial<S>) => Promise<void>;

  patchPublishing: (versionID: string, publishing: Partial<P>) => Promise<void>;
}

export type GenericVersionPlatformClient = VersionPlatformClient<Realtime.AnyVersionSettings, any>;

const PlatformClient = <S extends Realtime.AnyVersionSettings, P>(axios: AxiosInstance): VersionPlatformClient<S, P> => ({
  patchSettings: (versionID, settings) => axios.patch(`/version/${versionID}/settings`, settings),

  patchPublishing: (versionID, publishing) => axios.patch(`/version/${versionID}/publishing`, publishing),
});

const Client = ({ api, alexa, google, dialogflow, general }: ExtraOptions) => {
  const alexaClient = PlatformClient<AlexaVersion.Settings, AlexaVersion.Publishing>(alexa);
  const googleClient = PlatformClient<GoogleVersion.VoiceSettings, GoogleVersion.VoicePublishing>(google);
  const dialogflowClient = PlatformClient<DFESVersion.Settings, DFESVersion.Publishing>(dialogflow);
  const generalClient = PlatformClient<VoiceflowVersion.Settings, never>(general);

  const getPlatform = Realtime.Utils.platform.createPlatformSelector(
    {
      [VoiceflowConstants.PlatformType.ALEXA]: alexaClient as GenericVersionPlatformClient,
      [VoiceflowConstants.PlatformType.GOOGLE]: googleClient as GenericVersionPlatformClient,
      [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: dialogflowClient as GenericVersionPlatformClient,
    },
    generalClient as GenericVersionPlatformClient
  );

  return {
    ...createResourceClient(api, 'versions'),

    platform: Object.assign(getPlatform, {
      alexa: alexaClient,
      google: googleClient,
      dialogflow: dialogflowClient,
      general: generalClient,
    }),
  };
};

export type VersionClient = ReturnType<typeof Client>;

export default Client;

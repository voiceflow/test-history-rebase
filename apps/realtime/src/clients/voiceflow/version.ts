import { BaseVersion } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk';
import { AxiosInstance } from 'axios';

import { ExtraOptions } from './types';
import createResourceClient from './utils/resource';

export interface VersionPlatformClient {
  patchPublishing: (versionID: string, publishing: Partial<BaseVersion.Publishing>) => Promise<void>;
}

const PlatformClient = (axios: AxiosInstance): VersionPlatformClient => ({
  patchPublishing: (versionID, publishing) => axios.patch(`/version/${versionID}/publishing`, publishing),
});

const Client = ({ api, alexa, google, dialogflow, general }: ExtraOptions) => {
  const alexaClient = PlatformClient(alexa);
  const googleClient = PlatformClient(google);
  const generalClient = PlatformClient(general);
  const dialogflowClient = PlatformClient(dialogflow);

  const getPlatform = Realtime.Utils.platform.createPlatformSelector(
    {
      [Platform.Constants.PlatformType.ALEXA]: alexaClient,
      [Platform.Constants.PlatformType.GOOGLE]: googleClient,
      [Platform.Constants.PlatformType.DIALOGFLOW_ES]: dialogflowClient,
    },
    generalClient
  );

  return {
    ...createResourceClient(api, 'versions'),

    platform: Object.assign(getPlatform, {
      alexa: alexaClient,
      google: googleClient,
      general: generalClient,
      dialogflow: dialogflowClient,
    }),
  };
};

export type VersionClient = ReturnType<typeof Client>;

export default Client;

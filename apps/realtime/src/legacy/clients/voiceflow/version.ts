import { BaseVersion } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import { AxiosInstance } from 'axios';

import { ExtraOptions } from './types';
import createResourceClient from './utils/resource';

export interface VersionPlatformClient {
  patchPublishing: (versionID: string, publishing: Partial<BaseVersion.Publishing>) => Promise<void>;
}

const PlatformClient = (axios: AxiosInstance): VersionPlatformClient => ({
  patchPublishing: (versionID, publishing) => axios.patch(`/version/${versionID}/publishing`, publishing),
});

const Client = ({ api, alexa, general }: ExtraOptions) => {
  const alexaClient = PlatformClient(alexa);
  const generalClient = PlatformClient(general);

  const getPlatform = Realtime.Utils.platform.createPlatformSelector(
    {
      [Platform.Constants.PlatformType.ALEXA]: alexaClient,
    },
    generalClient
  );

  return {
    ...createResourceClient(api, 'versions'),

    platform: Object.assign(getPlatform, {
      alexa: alexaClient,
      general: generalClient,
    }),
  };
};

export type VersionClient = ReturnType<typeof Client>;

export default Client;

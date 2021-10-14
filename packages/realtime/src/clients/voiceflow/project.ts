import { Project } from '@voiceflow/api-sdk';
import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { AxiosInstance } from 'axios';

import { ExtraOptions } from './types';

export interface ProjectPlatformClient<P extends Project<any, any>> {
  duplicate: (projectID: string, data: Realtime.NewProject, params?: { channel: string }) => Promise<P>;
}

const PlatformClient = <P extends Project<any, any>>(axios: AxiosInstance): ProjectPlatformClient<P> => ({
  duplicate: (projectID, data, params?) => axios.post<P>(`/project/${projectID}/copy`, data, { params }).then((res) => res.data),
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Client = ({ api, alexa, google, general }: ExtraOptions) => {
  const alexaClient = PlatformClient<Realtime.AlexaProject>(alexa);
  const googleClient = PlatformClient<Realtime.GoogleProject>(google);
  const generalClient = PlatformClient<Realtime.GeneralProject>(general);

  const getPlatform = Realtime.Utils.platform.createPlatformSelector<typeof alexaClient | typeof googleClient | typeof generalClient>(
    {
      [Constants.PlatformType.ALEXA]: alexaClient,
      [Constants.PlatformType.GOOGLE]: googleClient,
    },
    generalClient
  );

  return {
    canRead: (creatorID: number, projectID: string): Promise<boolean> =>
      api
        .head(`/v2/user/${creatorID}/projects/${projectID}`)
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

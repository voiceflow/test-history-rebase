import type { BaseModels } from '@voiceflow/base-types';
import type { Nullish } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config/backend';
import * as Realtime from '@voiceflow/realtime-sdk/backend';
import type { AxiosInstance } from 'axios';

import type { ExtraOptions } from './types';
import createResourceClient from './utils/resource';

export interface ProjectPlatformClient<P extends BaseModels.Project.Model<any, any>> {
  duplicate: (projectID: string, data: Realtime.NewProject, params?: Record<string, unknown>) => Promise<P>;
}

const PlatformClient = <P extends BaseModels.Project.Model<any, any>>(
  axios: AxiosInstance
): ProjectPlatformClient<P> => ({
  duplicate: (projectID, data, params) =>
    axios.post<P>(`/project/${projectID}/copy`, data, { params }).then((res) => res.data),
});

const Client = ({ api, alexa, general }: ExtraOptions) => {
  const alexaClient = PlatformClient<Realtime.AlexaProject>(alexa);
  const generalClient = PlatformClient<Realtime.VoiceflowProject>(general);

  const getPlatform = Realtime.Utils.platform.createPlatformSelector<typeof alexaClient | typeof generalClient>(
    {
      [Platform.Constants.PlatformType.ALEXA]: alexaClient,
    },
    generalClient
  ) as <P extends BaseModels.Project.Model<any, any>>(
    platform?: Nullish<Platform.Constants.PlatformType>
  ) => ProjectPlatformClient<P>;

  return {
    ...createResourceClient(api, 'projects'),

    deleteV2: (projectID: string): Promise<boolean> => api.delete(`/v3/projects/${projectID}`),

    deleteMany: (projectIDs: string[]): Promise<boolean> => api.post('/v2/projects/delete-many', { projectIDs }),

    platform: Object.assign(getPlatform, {
      alexa: alexaClient,
      general: generalClient,
    }),
  };
};

export default Client;

export type ProjectClient = ReturnType<typeof Client>;

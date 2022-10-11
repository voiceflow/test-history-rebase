import { BaseModels } from '@voiceflow/base-types';
import { Nullish } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { AxiosInstance } from 'axios';

import { ExtraOptions } from './types';
import createResourceClient from './utils/resource';

export interface ProjectPlatformClient<P extends BaseModels.Project.Model<any, any>> {
  duplicate: (projectID: string, data: Realtime.NewProject, params?: { channel: string; onboarding: boolean }) => Promise<P>;
}

const PlatformClient = <P extends BaseModels.Project.Model<any, any>>(axios: AxiosInstance): ProjectPlatformClient<P> => ({
  duplicate: (projectID, data, params?) => axios.post<P>(`/project/${projectID}/copy`, data, { params }).then((res) => res.data),
});

const Client = ({ api, alexa, google, dialogflow, general }: ExtraOptions) => {
  const alexaClient = PlatformClient<Realtime.AlexaProject>(alexa);
  const googleClient = PlatformClient<Realtime.GoogleProject>(google);
  const dialogflowClient = PlatformClient<Realtime.DialogflowProject>(dialogflow);
  const generalClient = PlatformClient<Realtime.VoiceflowProject>(general);

  const getPlatform = Realtime.Utils.platform.createPlatformSelector<
    typeof alexaClient | typeof googleClient | typeof dialogflowClient | typeof generalClient
  >(
    {
      [VoiceflowConstants.PlatformType.ALEXA]: alexaClient,
      [VoiceflowConstants.PlatformType.GOOGLE]: googleClient,
      [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: dialogflowClient,
    },
    generalClient
  ) as <P extends BaseModels.Project.Model<any, any>>(platform?: Nullish<VoiceflowConstants.PlatformType>) => ProjectPlatformClient<P>;

  return {
    ...createResourceClient(api, 'projects'),

    deleteV2: (projectID: string): Promise<boolean> => api.delete(`/v3/projects/${projectID}`),

    deleteMany: (projectIDs: string[]): Promise<boolean> => api.post(`/v2/projects/delete-many`, { projectIDs }),

    platform: Object.assign(getPlatform, {
      alexa: alexaClient,
      google: googleClient,
      dialogflow: dialogflowClient,
      general: generalClient,
    }),
  };
};

export default Client;

export type ProjectClient = ReturnType<typeof Client>;

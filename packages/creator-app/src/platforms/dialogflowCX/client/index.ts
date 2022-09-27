import { googleService } from '@/client/fetch';
import { createPublishService } from '@/client/services';
import { GOOGLE_SERVICE_ENDPOINT } from '@/config';
import { GoogleStageType } from '@/constants/platforms';
import { DialogflowCXPublishJob } from '@/models';

import generalServiceClient from '../../general/client';
import type { AgentName, GCPAgent } from '../types';

const DIALOGFLOW_CX_ENDPOINT = `${GOOGLE_SERVICE_ENDPOINT}/dialogflow/cx`;

const dialogflowCXServiceClient = {
  modelImport: null,
  prototype: generalServiceClient.prototype,
  publish: {
    ...createPublishService<DialogflowCXPublishJob.AnyJob, GoogleStageType>(DIALOGFLOW_CX_ENDPOINT),
    checkAgent: (agentName: AgentName) => googleService.post<GCPAgent>(`dialogflow/cx/publish/agent`, { agentName }),
  },
  project: generalServiceClient.project,
  export: null,
};

export default dialogflowCXServiceClient;

import * as Platform from '@voiceflow/platform-config';

import { generalService, googleService } from '@/client/fetch';
import { createPublishService } from '@/client/services';
import { RESOURCE_ENDPOINT } from '@/client/services/modelImport';
import { GOOGLE_SERVICE_ENDPOINT } from '@/config';
import { GoogleStageType } from '@/constants/platforms';
import { DialogflowCXPublishJob, NLUImportModel } from '@/models';

import generalServiceClient from '../../general/client';
import type { AgentName, GCPAgent } from '../types';

const DIALOGFLOW_CX_ENDPOINT = `${GOOGLE_SERVICE_ENDPOINT}/dialogflow/cx`;

const dialogflowCXServiceClient = {
  modelImport: {
    // TO DO: Remove it once we have a proper endpoint for dfcx model import
    import: (_type: string, formData?: FormData) => {
      const importEndpoint = `${RESOURCE_ENDPOINT}/${Platform.Constants.PlatformType.VOICEFLOW}`;
      return generalService.post<NLUImportModel>(importEndpoint, formData, { json: false }).then((res) => res);
    },
  },
  prototype: generalServiceClient.prototype,
  publish: {
    ...createPublishService<DialogflowCXPublishJob.AnyJob, GoogleStageType>(DIALOGFLOW_CX_ENDPOINT),
    checkAgent: (agentName: AgentName) => googleService.post<GCPAgent>(`dialogflow/cx/publish/agent`, { agentName }),
  },
  project: generalServiceClient.project,
  export: null,
};

export default dialogflowCXServiceClient;

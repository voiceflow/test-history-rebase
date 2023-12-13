import * as Platform from '@voiceflow/platform-config';

import { generalService } from '@/client/fetch';
import { RESOURCE_ENDPOINT } from '@/client/services/modelImport';
import { NLUImportModel } from '@/models';

import generalServiceClient from '../../general/client';

const dialogflowCXServiceClient = {
  modelImport: {
    import: (_type: string, formData?: FormData) => {
      const importEndpoint = `${RESOURCE_ENDPOINT}/${Platform.Constants.NLUType.DIALOGFLOW_CX}`;
      return generalService.post<NLUImportModel>(importEndpoint, formData, { json: false }).then((res) => res);
    },
  },
  prototype: generalServiceClient.prototype,
  publish: generalServiceClient.publish,
  project: generalServiceClient.project,
  export: null,
};

export default dialogflowCXServiceClient;

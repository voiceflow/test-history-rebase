import { IntegrationType } from '@voiceflow/alexa-types';
import type { StepData as APIStepData } from '@voiceflow/alexa-types/build/nodes/api';
import type { StepData as GoogleSheetsStepData } from '@voiceflow/alexa-types/build/nodes/googleSheets';
import type { StepData as ZapierStepData } from '@voiceflow/alexa-types/build/nodes/zapier';

import { NodeData } from '@/models';

import apiAdapter from './api';
import googleSheetsAdapter from './googleSheets';
import { createBlockAdapter } from './utils';
import zapierAdapter from './zapier';

const interactionAdapter = createBlockAdapter<APIStepData | ZapierStepData | GoogleSheetsStepData, NodeData.Integration>(
  (data) => {
    switch (data.selectedIntegration) {
      case IntegrationType.CUSTOM_API:
        return apiAdapter.fromDB(data);
      case IntegrationType.ZAPIER:
        return zapierAdapter.fromDB(data);
      case IntegrationType.GOOGLE_SHEETS:
        return googleSheetsAdapter.fromDB(data);
      default:
        throw new Error('Integration adapter is not implemented yet!');
    }
  },
  (data) => {
    switch (data.selectedIntegration) {
      case IntegrationType.CUSTOM_API:
        return apiAdapter.toDB(data);
      case IntegrationType.ZAPIER:
        return zapierAdapter.toDB(data);
      case IntegrationType.GOOGLE_SHEETS:
        return googleSheetsAdapter.toDB(data);
      default:
        throw new Error('Integration adapter is not implemented yet!');
    }
  }
);

export default interactionAdapter;

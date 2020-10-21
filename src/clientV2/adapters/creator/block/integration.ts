import { IntegrationType } from '@voiceflow/general-types';
import type { StepData as APIStepData } from '@voiceflow/general-types/build/nodes/api';
import type { StepData as GoogleSheetsStepData } from '@voiceflow/general-types/build/nodes/googleSheets';
import type { StepData as ZapierStepData } from '@voiceflow/general-types/build/nodes/zapier';

import { NodeData } from '@/models';

import apiAdapter from './api';
import googleSheetsAdapter from './googleSheets';
import { createBlockAdapter } from './utils';
import zapierAdapter from './zapier';

const interactionAdapter = createBlockAdapter<APIStepData | ZapierStepData | GoogleSheetsStepData, NodeData.Integration>(
  (data, ...args) => {
    switch (data.selectedIntegration) {
      case IntegrationType.CUSTOM_API:
        return apiAdapter.fromDB(data, ...args);
      case IntegrationType.ZAPIER:
        return zapierAdapter.fromDB(data, ...args);
      case IntegrationType.GOOGLE_SHEETS:
        return googleSheetsAdapter.fromDB(data, ...args);
      default:
        throw new Error('Integration adapter is not implemented yet!');
    }
  },
  (data, ...args) => {
    switch (data.selectedIntegration) {
      case IntegrationType.CUSTOM_API:
        return apiAdapter.toDB(data, ...args);
      case IntegrationType.ZAPIER:
        return zapierAdapter.toDB(data, ...args);
      case IntegrationType.GOOGLE_SHEETS:
        return googleSheetsAdapter.toDB(data, ...args);
      default:
        throw new Error('Integration adapter is not implemented yet!');
    }
  }
);

export default interactionAdapter;

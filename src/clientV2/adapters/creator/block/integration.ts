import { IntegrationType } from '@voiceflow/alexa-types';
import type { StepData as APIStepData } from '@voiceflow/alexa-types/build/nodes/api';

import { NodeData } from '@/models';

import apiAdapter from './api';
import { createBlockAdapter } from './utils';

const interactionAdapter = createBlockAdapter<APIStepData, NodeData.Integration>(
  (data) => {
    switch (data.selectedIntegration) {
      case IntegrationType.CUSTOM_API:
        return apiAdapter.fromDB(data);
      case IntegrationType.ZAPIER:
      case IntegrationType.GOOGLE_SHEETS:
      default:
        throw new Error('Integration adapter is not implemented yet!');
    }
  },
  (data) => {
    switch (data.selectedIntegration) {
      case IntegrationType.CUSTOM_API:
        return apiAdapter.toDB(data);
      case IntegrationType.ZAPIER:
      case IntegrationType.GOOGLE_SHEETS:
      default:
        throw new Error('Integration adapter is not implemented yet!');
    }
  }
);

export default interactionAdapter;

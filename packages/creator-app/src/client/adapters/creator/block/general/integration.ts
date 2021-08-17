import { Node } from '@voiceflow/base-types';

import { NodeData } from '@/models';

import { createBlockAdapter } from '../utils';
import apiAdapter from './api';
import googleSheetsAdapter from './googleSheets';
import zapierAdapter from './zapier';

const integrationAdapter = createBlockAdapter<Node.Api.StepData | Node.Zapier.StepData | Node.GoogleSheets.StepData, NodeData.Integration>(
  (data, ...args) => {
    switch (data.selectedIntegration) {
      case Node.Utils.IntegrationType.CUSTOM_API:
        return apiAdapter.fromDB(data, ...args);
      case Node.Utils.IntegrationType.ZAPIER:
        return zapierAdapter.fromDB(data, ...args);
      case Node.Utils.IntegrationType.GOOGLE_SHEETS:
        return googleSheetsAdapter.fromDB(data, ...args);
      default:
        throw new Error('Integration adapter is not implemented yet!');
    }
  },
  (data, ...args) => {
    switch (data.selectedIntegration) {
      case Node.Utils.IntegrationType.CUSTOM_API:
        return apiAdapter.toDB(data, ...args);
      case Node.Utils.IntegrationType.ZAPIER:
        return zapierAdapter.toDB(data, ...args);
      case Node.Utils.IntegrationType.GOOGLE_SHEETS:
        return googleSheetsAdapter.toDB(data, ...args);
      default:
        throw new Error('Integration adapter is not implemented yet!');
    }
  }
);

export default integrationAdapter;

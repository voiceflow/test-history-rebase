import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextAndFailOnlyOutPortsAdapter,
  nextAndFailOnlyOutPortsAdapterV2,
} from '../utils';
import apiAdapter from './api';
import googleSheetsAdapter from './googleSheets';
import zapierAdapter from './zapier';

const integrationAdapter = createBlockAdapter<
  BaseNode.Api.StepData | BaseNode.Zapier.StepData | BaseNode.GoogleSheets.StepData,
  NodeData.Integration
>(
  (data, ...args) => {
    switch (data.selectedIntegration) {
      case BaseNode.Utils.IntegrationType.CUSTOM_API:
        return apiAdapter.fromDB(data, ...args);
      case BaseNode.Utils.IntegrationType.ZAPIER:
        return zapierAdapter.fromDB(data, ...args);
      case BaseNode.Utils.IntegrationType.GOOGLE_SHEETS:
        return googleSheetsAdapter.fromDB(data, ...args);
      default:
        throw new Error('Integration adapter is not implemented yet!');
    }
  },
  (data, ...args) => {
    switch (data.selectedIntegration) {
      case BaseNode.Utils.IntegrationType.CUSTOM_API:
        return apiAdapter.toDB(data, ...args);
      case BaseNode.Utils.IntegrationType.ZAPIER:
        return zapierAdapter.toDB(data, ...args);
      case BaseNode.Utils.IntegrationType.GOOGLE_SHEETS:
        return googleSheetsAdapter.toDB(data, ...args);
      default:
        throw new Error('Integration adapter is not implemented yet!');
    }
  }
);

export const integrationOutPortsAdapter = createOutPortsAdapter<NodeData.IntegrationBuiltInPorts, NodeData.Integration>(
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.fromDB(dbPorts, options),
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapter.toDB(dbPorts, options)
);

export const integrationOutPortsAdapterV2 = createOutPortsAdapterV2<NodeData.IntegrationBuiltInPorts, NodeData.Integration>(
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapterV2.fromDB(dbPorts, options),
  (dbPorts, options) => nextAndFailOnlyOutPortsAdapterV2.toDB(dbPorts, options)
);

export default integrationAdapter;

import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import {
  createBlockAdapter,
  createOutPortsAdapter,
  createOutPortsAdapterV2,
  nextAndFailOnlyOutPortsAdapter,
  nextAndFailOnlyOutPortsAdapterV2,
} from '../utils';

const integrationAdapter = createBlockAdapter<BaseNode.Api.StepData, NodeData.CustomApi>(
  ({ url, body, headers, mappings, content, selectedAction, params, bodyType, tls, selectedIntegration }) => {
    // only API steps are supported, google & zapier steps are deprecated
    if (selectedIntegration !== BaseNode.Utils.IntegrationType.CUSTOM_API) {
      throw new Error('invalid integration type');
    }

    return {
      url,
      tls: tls ? { key: tls.key ?? null, cert: tls.cert ?? null } : null,
      body,
      content,
      headers,
      mapping: mappings,
      parameters: params,
      bodyInputType: bodyType,
      selectedAction,
      selectedIntegration: BaseNode.Utils.IntegrationType.CUSTOM_API,
    };
  },
  ({
    tls,
    url = '',
    body = [],
    content = '',
    headers = [],
    mapping = [],
    parameters = [],
    bodyInputType = BaseNode.Api.APIBodyType.FORM_DATA,
    selectedAction = BaseNode.Api.APIActionType.GET,
    selectedIntegration,
  }) => {
    // only API steps are supported, google & zapier steps are deprecated
    if (selectedIntegration !== BaseNode.Utils.IntegrationType.CUSTOM_API) {
      throw new Error('invalid integration type');
    }

    return {
      tls: tls ? { key: tls.key ?? undefined, cert: tls.cert ?? undefined } : undefined,
      url,
      body,
      params: parameters,
      method: selectedAction.split(' ')[2] as BaseNode.Api.APIMethod,
      headers,
      content,
      mappings: mapping,
      bodyType: bodyInputType,
      selectedAction: selectedAction as BaseNode.Api.APIActionType,
      selectedIntegration: BaseNode.Utils.IntegrationType.CUSTOM_API,
    };
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

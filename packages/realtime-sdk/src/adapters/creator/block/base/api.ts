import { NodeData } from '@realtime-sdk/models';
import { Node } from '@voiceflow/base-types';

import { createBlockAdapter } from '../utils';

const apiAdapter = createBlockAdapter<Node.Api.StepData, NodeData.CustomApi>(
  ({ url, body, headers, mappings, content, selectedAction, params, bodyType }) => ({
    url,
    body,
    content,
    headers,
    mapping: mappings,
    parameters: params,
    bodyInputType: bodyType,
    selectedAction,
    selectedIntegration: Node.Utils.IntegrationType.CUSTOM_API,
  }),
  ({
    url = '',
    body = [],
    content = '',
    headers = [],
    mapping = [],
    parameters = [],
    bodyInputType = Node.Api.APIBodyType.FORM_DATA,
    selectedAction = Node.Api.APIActionType.GET,
  }) => ({
    url,
    body,
    params: parameters,
    method: selectedAction.split(' ')[2] as Node.Api.APIMethod,
    headers,
    content,
    mappings: mapping,
    bodyType: bodyInputType,
    selectedAction: selectedAction as Node.Api.APIActionType,
    selectedIntegration: Node.Utils.IntegrationType.CUSTOM_API,
  })
);

export default apiAdapter;

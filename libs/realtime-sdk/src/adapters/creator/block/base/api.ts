import { NodeData } from '@realtime-sdk/models';
import { BaseNode } from '@voiceflow/base-types';

import { createBlockAdapter } from '../utils';

const apiAdapter = createBlockAdapter<BaseNode.Api.StepData, NodeData.CustomApi>(
  ({ url, body, headers, mappings, content, selectedAction, params, bodyType, tls }) => ({
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
  }),
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
  }) => ({
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
  })
);

export default apiAdapter;

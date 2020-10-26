import { IntegrationType } from '@voiceflow/google-types';
import { APIActionType, APIBodyType, APIMethod, StepData } from '@voiceflow/general-types/build/nodes/api';

import { NodeData } from '@/models';

import { createBlockAdapter } from './utils';

const apiAdapter = createBlockAdapter<StepData, NodeData.CustomApi>(
  ({ url, body, headers, mappings, content, selectedAction, params, bodyType }) => ({
    url,
    body,
    content,
    headers,
    mapping: mappings,
    parameters: params,
    bodyInputType: bodyType,
    selectedAction,
    selectedIntegration: IntegrationType.CUSTOM_API,
  }),
  ({
    url = '',
    body = [],
    content = '',
    headers = [],
    mapping = [],
    parameters = [],
    bodyInputType = APIBodyType.FORM_DATA,
    selectedAction = APIActionType.GET,
  }) => ({
    url,
    body,
    params: parameters,
    method: selectedAction.split(' ')[2] as APIMethod,
    headers,
    content,
    mappings: mapping,
    bodyType: bodyInputType,
    selectedAction: selectedAction as APIActionType,
    selectedIntegration: IntegrationType.CUSTOM_API,
  })
);

export default apiAdapter;

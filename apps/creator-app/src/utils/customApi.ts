import { BaseNode } from '@voiceflow/base-types';

export const getCustomAPIActionLabel = (apiActionType?: string): string => {
  const CUSTOM_API_ACTION_TYPE_LABEL_MAP = {
    [BaseNode.Api.APIActionType.GET]: 'GET',
    [BaseNode.Api.APIActionType.POST]: 'POST',
    [BaseNode.Api.APIActionType.PUT]: 'PUT',
    [BaseNode.Api.APIActionType.DELETE]: 'DELETE',
    [BaseNode.Api.APIActionType.PATCH]: 'PATCH',
  };

  return CUSTOM_API_ACTION_TYPE_LABEL_MAP[apiActionType as BaseNode.Api.APIActionType] || 'GET';
};

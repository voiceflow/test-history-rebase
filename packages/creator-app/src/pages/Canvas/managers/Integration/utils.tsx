import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { VariableLabel } from '@/pages/Canvas/components/Step';

const getCustomApiAction = (action: string | undefined) => {
  switch (action) {
    case BaseNode.Api.APIActionType.POST:
      return 'POST';
    case BaseNode.Api.APIActionType.PUT:
      return 'PUT';
    case BaseNode.Api.APIActionType.DELETE:
      return 'DELETE';
    case BaseNode.Api.APIActionType.PATCH:
      return 'PATCH';
    default:
      return 'GET';
  }
};

export const getLabel = (data: Realtime.NodeData.Integration): React.ReactNode => {
  switch (data.selectedIntegration) {
    case BaseNode.Utils.IntegrationType.ZAPIER:
      return data.user?.user_data ? (
        <>
          Trigger '<VariableLabel>{data.user.user_data.name}</VariableLabel>'
        </>
      ) : (
        ''
      );
    case BaseNode.Utils.IntegrationType.CUSTOM_API:
      return data.url ? (
        <>
          Send <VariableLabel>{getCustomApiAction(data.selectedAction)}</VariableLabel> request
        </>
      ) : (
        ''
      );
    case BaseNode.Utils.IntegrationType.GOOGLE_SHEETS:
      return data.selectedAction && data.sheet?.label ? (
        <>
          {data.selectedAction} in <VariableLabel>{data.sheet.label}</VariableLabel>
        </>
      ) : (
        ''
      );
    default:
      return '';
  }
};

export const getPlaceholder = (data: Realtime.NodeData.Integration): string => {
  switch (data.selectedIntegration) {
    case BaseNode.Utils.IntegrationType.ZAPIER:
      return 'Trigger a Zap';
    case BaseNode.Utils.IntegrationType.CUSTOM_API:
      return 'Custom API';
    case BaseNode.Utils.IntegrationType.GOOGLE_SHEETS:
      return 'Connect a Google Sheet';
    default:
      return '';
  }
};

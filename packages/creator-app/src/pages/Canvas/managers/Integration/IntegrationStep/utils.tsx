import { Node } from '@voiceflow/base-types';
import React from 'react';

import { IntegrationType } from '@/constants';
import { NodeData } from '@/models';
import { VariableLabel } from '@/pages/Canvas/components/Step';

const getCustomApiAction = (action: string | undefined) => {
  switch (action) {
    case Node.Api.APIActionType.POST:
      return 'POST';
    case Node.Api.APIActionType.PUT:
      return 'PUT';
    case Node.Api.APIActionType.DELETE:
      return 'DELETE';
    case Node.Api.APIActionType.PATCH:
      return 'PATCH';
    default:
      return 'GET';
  }
};

export const getLabel = (data: NodeData.Integration): React.ReactNode => {
  switch (data.selectedIntegration) {
    case IntegrationType.ZAPIER:
      return data.user?.user_data ? (
        <>
          Trigger '<VariableLabel>{data.user.user_data.name}</VariableLabel>'
        </>
      ) : (
        ''
      );
    case IntegrationType.CUSTOM_API:
      return data.url ? (
        <>
          Send <VariableLabel>{getCustomApiAction(data.selectedAction)}</VariableLabel> request
        </>
      ) : (
        ''
      );
    case IntegrationType.GOOGLE_SHEETS:
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

export const getPlaceholder = (data: NodeData.Integration): string => {
  switch (data.selectedIntegration) {
    case IntegrationType.ZAPIER:
      return 'Trigger a Zap';
    case IntegrationType.CUSTOM_API:
      return 'Custom API';
    case IntegrationType.GOOGLE_SHEETS:
      return 'Connect a Google Sheet';
    default:
      return '';
  }
};

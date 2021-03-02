import { APIActionType } from '@voiceflow/general-types/build/nodes/api';
import React from 'react';

import { IntegrationType } from '@/constants';
import { NodeData } from '@/models';
import { VariableLabel } from '@/pages/Canvas/components/Step';

const getCustomApiAction = (action: string | undefined) => {
  switch (action) {
    case APIActionType.POST:
      return 'POST';
    case APIActionType.PUT:
      return 'PUT';
    case APIActionType.DELETE:
      return 'DELETE';
    case APIActionType.PATCH:
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

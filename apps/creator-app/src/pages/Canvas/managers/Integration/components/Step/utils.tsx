import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { VariableLabel } from '@/pages/Canvas/components/Step';
import { transformVariablesToReadable } from '@/utils/slot';

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
          Trigger '<VariableLabel>{transformVariablesToReadable(data.user.user_data.name)}</VariableLabel>'
        </>
      ) : (
        ''
      );
    case BaseNode.Utils.IntegrationType.CUSTOM_API:
      return data.url ? <VariableLabel>{transformVariablesToReadable(data.url)}</VariableLabel> : '';
    case BaseNode.Utils.IntegrationType.GOOGLE_SHEETS:
      return data.selectedAction && data.sheet?.label ? (
        <>
          {data.selectedAction} in <VariableLabel>{transformVariablesToReadable(data.sheet.label)}</VariableLabel>
        </>
      ) : (
        ''
      );
    default:
      return '';
  }
};

export const getDescriptions = (data: Realtime.NodeData.Integration): { title?: string | null; label: string } => {
  switch (data.selectedIntegration) {
    case BaseNode.Utils.IntegrationType.ZAPIER:
      return { title: null, label: 'Trigger a Zap' };
    case BaseNode.Utils.IntegrationType.CUSTOM_API:
      return { title: getCustomApiAction(data.selectedAction), label: 'Enter request URL' };
    case BaseNode.Utils.IntegrationType.GOOGLE_SHEETS:
      return { title: null, label: 'Connect a Google Sheet' };
    default:
      return { title: null, label: '' };
  }
};

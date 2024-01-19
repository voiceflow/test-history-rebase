import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { FailureStepItemV2, Item, Section, SuccessStepItemV2, VariableLabel } from '@/pages/Canvas/components/Step';
import { ActiveDiagramNormalizedEntitiesAndVariablesContext } from '@/pages/Canvas/contexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { transformVariablesToReadable } from '@/utils/slot';

import { NODE_CONFIG } from '../../constants';

const getCustomApiAction = (action?: string) => {
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

const IntegrationStep: ConnectedStep<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts> = ({
  ports,
  data,
  withPorts,
  palette,
}) => {
  const entitiesAndVariables = React.useContext(ActiveDiagramNormalizedEntitiesAndVariablesContext)!;

  return (
    <Step nodeID={data.nodeID}>
      <Section v2 withIcon>
        <Item
          v2
          icon={NODE_CONFIG.icon}
          label={data.url ? <VariableLabel>{transformVariablesToReadable(data.url, entitiesAndVariables.byKey)}</VariableLabel> : ''}
          title={getCustomApiAction(data.selectedAction)}
          palette={palette}
          placeholder="Enter request URL"
          labelVariant={StepLabelVariant.PRIMARY}
          multilineLabel
          labelLineClamp={2}
        />

        {withPorts && (
          <>
            <SuccessStepItemV2 label="Success" portID={ports.out.builtIn[BaseModels.PortType.NEXT]} />
            <FailureStepItemV2 label="Fail" portID={ports.out.builtIn[BaseModels.PortType.FAIL]} />
          </>
        )}
      </Section>
    </Step>
  );
};

export default IntegrationStep;

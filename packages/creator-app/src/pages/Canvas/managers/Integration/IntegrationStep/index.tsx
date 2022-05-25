import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';
import { getLabel, getPlaceholder } from '../utils';

export interface IntegrationStepProps {
  data: Realtime.NodeData.Integration;
  nodeID: string;
  withPorts: boolean;
  successPortID: string;
  failurePortID: string;
  variant: BlockVariant;
}

export const IntegrationStep: React.FC<IntegrationStepProps> = ({ data, withPorts, nodeID, successPortID, failurePortID, variant }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.getIcon!(data)}
        label={getLabel(data)}
        variant={variant}
        placeholder={getPlaceholder(data)}
        labelVariant={StepLabelVariant.SECONDARY}
        iconColor="#62778c"
      />
    </Section>

    <Section>
      {withPorts && (
        <>
          <SuccessItem label="Success" portID={successPortID} />
          <FailureItem label="Failure" portID={failurePortID} />
        </>
      )}
    </Section>
  </Step>
);

const ConnectedIntegrationStep: ConnectedStep<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts> = ({
  ports,
  data,
  withPorts,
  variant,
}) => (
  <IntegrationStep
    data={data}
    nodeID={data.nodeID}
    withPorts={withPorts}
    successPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
    failurePortID={ports.out.builtIn[BaseModels.PortType.FAIL]}
    variant={variant}
  />
);

export default ConnectedIntegrationStep;

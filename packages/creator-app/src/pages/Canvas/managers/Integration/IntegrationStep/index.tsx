import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';
import { getLabel, getPlaceholder } from './utils';

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
  node,
  data,
  withPorts,
  variant,
}) => (
  <IntegrationStep
    data={data}
    nodeID={node.id}
    withPorts={withPorts}
    successPortID={node.ports.out.builtIn[Models.PortType.NEXT]}
    failurePortID={node.ports.out.builtIn[Models.PortType.FAIL]}
    variant={variant}
  />
);

export default ConnectedIntegrationStep;

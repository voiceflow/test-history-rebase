import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, FailureItem, Item, Section, SuccessItem } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';
import { getLabel, getPlaceholder } from './utils';

export interface IntegrationStepProps {
  data: NodeData.Integration;
  withPorts: boolean;
  nodeID: string;
  successPortID: string;
  failurePortID: string;
}

export const IntegrationStep: React.FC<IntegrationStepProps> = ({ data, withPorts, nodeID, successPortID, failurePortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.getIcon!(data)}
        label={getLabel(data)}
        iconColor={NODE_CONFIG.getIconColor!(data)}
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

const ConnectedIntegrationStep: React.FC<ConnectedStepProps<NodeData.Integration>> = ({ node, data, withPorts }) => {
  const [successPortID, failurePortID] = node.ports.out;

  return <IntegrationStep data={data} nodeID={node.id} successPortID={successPortID} failurePortID={failurePortID} withPorts={withPorts} />;
};

export default ConnectedIntegrationStep;

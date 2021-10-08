import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface CustomPayloadStepProps {
  nodeID: string;
  portID: string;
}

export const CustomPayloadStep: React.FC<CustomPayloadStepProps> = ({ nodeID, portID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label="Add custom payload"
        portID={portID}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Add custom payload"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedActionStep: React.FC<ConnectedStepProps<NodeData.CustomPayload>> = ({ node }) => (
  <CustomPayloadStep nodeID={node.id} portID={node.ports.out[0]} />
);

export default ConnectedActionStep;

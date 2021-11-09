import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface DirectiveStepProps {
  nodeID: string;
  portID: string;
}

export const DirectiveStep: React.FC<DirectiveStepProps> = ({ nodeID, portID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label="Directive"
        portID={portID}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Send Alexa Directive"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedActionStep: React.FC<ConnectedStepProps<Realtime.NodeData.Directive>> = ({ node }) => (
  <DirectiveStep nodeID={node.id} portID={node.ports.out[0]} />
);

export default ConnectedActionStep;

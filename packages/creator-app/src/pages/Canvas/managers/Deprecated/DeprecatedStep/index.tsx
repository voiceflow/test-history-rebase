import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface DeprecatedStepProps {
  nodeID: string;
  ports: string[];
}

const DeprecatedStep: React.FC<DeprecatedStepProps> = ({ nodeID, ports }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item icon={NODE_CONFIG.icon} iconColor={NODE_CONFIG.iconColor} placeholder="Deprecated" />
    </Section>

    <Section>
      {ports.map((portID, index) => (
        <Item key={portID} portID={portID} placeholder={`Path ${index + 1}`} />
      ))}
    </Section>
  </Step>
);

const ConnectedDeprecatedStep: React.FC<ConnectedStepProps<Realtime.NodeData.Deprecated>> = ({ node }) => (
  <DeprecatedStep nodeID={node.id} ports={node.ports.out} />
);

export default ConnectedDeprecatedStep;

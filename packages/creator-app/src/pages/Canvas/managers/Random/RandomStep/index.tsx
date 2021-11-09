import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface RandomStepProps {
  nodeID: string;
  ports: string[];
}

export const RandomStep: React.FC<RandomStepProps> = ({ nodeID, ports }) => (
  <Step nodeID={nodeID}>
    <Section>
      {ports.map((portID, index) => (
        <Item
          portID={portID}
          label={`Path ${index + 1}`}
          labelVariant={StepLabelVariant.SECONDARY}
          icon={index === 0 ? NODE_CONFIG.icon : null}
          iconColor={NODE_CONFIG.iconColor}
          key={portID}
        />
      ))}
    </Section>
  </Step>
);

const ConnectedRandomStep: React.FC<ConnectedStepProps<Realtime.NodeData.Random>> = ({ node }) => (
  <RandomStep nodeID={node.id} ports={node.ports.out} />
);

export default ConnectedRandomStep;

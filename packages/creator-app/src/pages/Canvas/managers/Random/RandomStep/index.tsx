import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';

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
          key={portID}
          icon={index === 0 ? NODE_CONFIG.icon : null}
          label={`Path ${index + 1}`}
          portID={portID}
          iconColor={NODE_CONFIG.iconColor}
          labelVariant={StepLabelVariant.SECONDARY}
        />
      ))}
    </Section>
  </Step>
);

const ConnectedRandomStep: ConnectedStep<Realtime.NodeData.Random> = ({ node }) => <RandomStep nodeID={node.id} ports={node.ports.out.dynamic} />;

export default ConnectedRandomStep;

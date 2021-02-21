import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

export type RandomStepProps = {
  nodeID: string;
  ports: string[];
};

export const RandomStep: React.FC<RandomStepProps> = ({ nodeID, ports }) => (
  <Step nodeID={nodeID}>
    <Section>
      {ports.map((portID, index) => (
        <Item
          portID={portID}
          label={`Path ${index + 1}`}
          labelVariant={StepLabelVariant.SECONDARY}
          icon={index === 0 ? 'randomLoop' : null}
          iconColor="#616c60"
          key={portID}
        />
      ))}
    </Section>
  </Step>
);

const ConnectedRandomStep: React.FC<ConnectedStepProps<NodeData.Random>> = ({ node }) => <RandomStep nodeID={node.id} ports={node.ports.out} />;

export default ConnectedRandomStep;

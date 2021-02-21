import React from 'react';

import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

export type DeprecatedStepProps = {
  nodeID: string;
  ports: string[];
};

const DeprecatedStep: React.FC<DeprecatedStepProps> = ({ nodeID, ports }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item icon="close" iconColor="#adadad" placeholder="Deprecated" />
    </Section>
    <Section>
      {ports.map((portID, index) => (
        <Item portID={portID} placeholder={`Path ${index + 1}`} key={portID} />
      ))}
    </Section>
  </Step>
);

const ConnectedDeprecatedStep: React.FC<ConnectedStepProps<NodeData.Deprecated>> = ({ node }) => (
  <DeprecatedStep nodeID={node.id} ports={node.ports.out} />
);

export default ConnectedDeprecatedStep;

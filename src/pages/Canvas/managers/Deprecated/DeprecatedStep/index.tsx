import React from 'react';

import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

export type DeprecatedStepProps = {
  ports: string[];
};

const DeprecatedStep: React.FC<DeprecatedStepProps> = ({ ports }) => (
  <Step>
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

const ConnectedDeprecatedStep: React.FC<ConnectedStepProps<NodeData.Deprecated>> = ({ node }) => <DeprecatedStep ports={node.ports.out} />;

export default ConnectedDeprecatedStep;

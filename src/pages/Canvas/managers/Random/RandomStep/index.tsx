import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

export type RandomStepProps = ConnectedStepProps['stepProps'] & {
  ports: string[];
};

export const RandomStep: React.FC<RandomStepProps> = ({ ports, withPorts, isActive, onClick }) => (
  <Step isActive={isActive} onClick={onClick}>
    <Section>
      {ports.map((portID, index) => (
        <Item
          portID={withPorts ? portID : null}
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

const ConnectedRandomStep: React.FC<ConnectedStepProps<NodeData.Random>> = ({ node, stepProps }) => (
  <RandomStep ports={node.ports.out} {...stepProps} />
);

export default ConnectedRandomStep;

import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

export type DirectiveStepProps = {
  portID: string;
};

export const DirectiveStep: React.FC<DirectiveStepProps> = ({ portID }) => (
  <Step>
    <Section>
      <Item
        portID={portID}
        label="Directive"
        labelVariant={StepLabelVariant.SECONDARY}
        icon="directive"
        iconColor="#5589eb"
        placeholder="Send Alexa Directive"
      />
    </Section>
  </Step>
);

const ConnectedCardStep: React.FC<ConnectedStepProps<NodeData.Directive>> = ({ node }) => <DirectiveStep portID={node.ports.out[0]} />;

export default ConnectedCardStep;

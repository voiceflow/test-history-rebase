import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

export type DirectiveStepProps = {
  nodeID: string;
  portID: string;
};

export const DirectiveStep: React.FC<DirectiveStepProps> = ({ nodeID, portID }) => (
  <Step nodeID={nodeID}>
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

const ConnectedCardStep: React.FC<ConnectedStepProps<NodeData.Directive>> = ({ node }) => (
  <DirectiveStep nodeID={node.id} portID={node.ports.out[0]} />
);

export default ConnectedCardStep;

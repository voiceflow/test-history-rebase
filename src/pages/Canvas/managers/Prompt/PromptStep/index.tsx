import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

export type PromptStepProps = {
  nodeID: string;
};

export const PromptStep: React.FC<PromptStepProps> = ({ nodeID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item label="Listening for an intent…" portID={null} labelVariant={StepLabelVariant.SECONDARY} icon="prompt" iconColor="#5C6BC0" />
    </Section>
  </Step>
);

const ConnectedPromptStep: React.FC<ConnectedStepProps<NodeData.Prompt>> = ({ node }) => <PromptStep nodeID={node.id} />;

export default ConnectedPromptStep;

import React from 'react';

import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Section } from '@/pages/Canvas/components/Step';

export type PromptStepProps = {};

export const PromptStep: React.FC<PromptStepProps> = () => (
  <Step>
    <Section>Prompt Step</Section>
  </Step>
);

const ConnectedPromptStep: React.FC<ConnectedStepProps<NodeData.Prompt>> = () => <PromptStep />;

export default ConnectedPromptStep;

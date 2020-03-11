import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';

export type FlowStartStepProps = {
  portID: string;
};

const FlowStartStep: React.FC<FlowStartStepProps> = ({ portID }) => (
  <Step>
    <Section>
      <Item icon="inFlow" iconColor="#279745" label="Conversation continues here" labelVariant={StepLabelVariant.SECONDARY} portID={portID} />
    </Section>
  </Step>
);

export default FlowStartStep;

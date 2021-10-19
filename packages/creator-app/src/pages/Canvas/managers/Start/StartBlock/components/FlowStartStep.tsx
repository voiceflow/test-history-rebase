import React from 'react';

import { FeatureFlag } from '@/config/features';
import { StepLabelVariant } from '@/constants/canvas';
import { useFeature } from '@/hooks';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';

export interface FlowStartStepProps {
  label?: string;
  portID: string;
}

const FlowStartStep: React.FC<FlowStartStepProps> = ({ label, portID }) => {
  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);

  return (
    <Step disableHighlightStyle>
      <Section>
        <Item
          icon="inFlow"
          label={label || (topicsAndComponents.isEnabled ? 'Component starts here' : 'Conversation continues here')}
          portID={portID}
          iconColor="#279745"
          labelVariant={StepLabelVariant.SECONDARY}
        />
      </Section>
    </Step>
  );
};

export default FlowStartStep;

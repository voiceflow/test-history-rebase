import React from 'react';

import { FeatureFlag } from '@/config/features';
import { StepLabelVariant } from '@/constants/canvas';
import * as ProjectV2 from '@/ducks/projectV2';
import { useFeature, useSelector } from '@/hooks';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';

export interface FlowStartStepProps {
  label?: string;
  portID: string;
}

const FlowStartStep: React.FC<FlowStartStepProps> = ({ label, portID }) => {
  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  return (
    <Step disableHighlightStyle>
      <Section>
        <Item
          icon="inFlow"
          label={label || (topicsAndComponents.isEnabled && isTopicsAndComponentsVersion ? 'Component starts here' : 'Conversation continues here')}
          portID={portID}
          iconColor="#279745"
          labelVariant={StepLabelVariant.PRIMARY}
        />
      </Section>
    </Step>
  );
};

export default FlowStartStep;

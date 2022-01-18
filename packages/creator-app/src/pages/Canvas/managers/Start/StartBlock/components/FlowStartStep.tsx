import React from 'react';

import { FeatureFlag } from '@/config/features';
import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import * as ProjectV2 from '@/ducks/projectV2';
import { useFeature, useSelector } from '@/hooks';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';

export interface FlowStartStepProps {
  label?: string;
  portID: string;
  variant: BlockVariant;
}

const FlowStartStep: React.FC<FlowStartStepProps> = ({ label, portID, variant }) => {
  const topicsAndComponents = useFeature(FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  return (
    <Step disableHighlightStyle>
      <Section>
        <Item
          icon="inFlow"
          label={label || (topicsAndComponents.isEnabled && isTopicsAndComponentsVersion ? 'Component starts here' : 'Conversation continues here')}
          portID={portID}
          variant={variant}
          labelVariant={StepLabelVariant.PRIMARY}
        />
      </Section>
    </Step>
  );
};

export default FlowStartStep;

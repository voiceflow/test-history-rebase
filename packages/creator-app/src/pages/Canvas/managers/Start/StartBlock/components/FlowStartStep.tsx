import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import * as ProjectV2 from '@/ducks/projectV2';
import { useFeature, useSelector } from '@/hooks';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';

export interface FlowStartStepProps {
  label?: string;
  portID: string;
  palette: HSLShades;
}

const FlowStartStep: React.FC<FlowStartStepProps> = ({ label, portID, palette }) => {
  const topicsAndComponents = useFeature(Realtime.FeatureFlag.TOPICS_AND_COMPONENTS);
  const isTopicsAndComponentsVersion = useSelector(ProjectV2.active.isTopicsAndComponentsVersionSelector);

  return (
    <Step disableHighlightStyle>
      <Section>
        <Item
          icon="inFlow"
          label={label || (topicsAndComponents.isEnabled && isTopicsAndComponentsVersion ? 'Flow starts here' : 'Conversation continues here')}
          portID={portID}
          palette={palette}
          labelVariant={StepLabelVariant.PRIMARY}
        />
      </Section>
    </Step>
  );
};

export default FlowStartStep;

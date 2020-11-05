import React from 'react';

import { PLATFORM_META, PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';

export type HomeStartStepProps = {
  platform: PlatformType;
  invocationName: string;
  portID: string;
};

const HomeStartStep: React.FC<HomeStartStepProps> = ({ platform, invocationName, portID }) => {
  return (
    <Step disableHighlightStyle>
      <Section>
        <Item
          icon={PLATFORM_META[platform].icon}
          iconColor="#369f52"
          label={platform === PlatformType.ALEXA ? `Alexa, open ${invocationName}` : `Hey Google, start ${invocationName}`}
          labelVariant={StepLabelVariant.PRIMARY}
          portID={portID}
        />
      </Section>
    </Step>
  );
};

export default HomeStartStep;

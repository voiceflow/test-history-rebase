import React from 'react';

import { PLATFORM_META, PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { getPlatformValue } from '@/utils/platform';

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
          label={getPlatformValue(platform, {
            [PlatformType.ALEXA]: `Alexa, open ${invocationName}`,
            [PlatformType.GOOGLE]: `Hey Google, start ${invocationName}`,
            [PlatformType.GENERAL]: 'Project starts here',
          })}
          labelVariant={PlatformType.GENERAL ? StepLabelVariant.SECONDARY : StepLabelVariant.PRIMARY}
          portID={portID}
        />
      </Section>
    </Step>
  );
};

export default HomeStartStep;

import React from 'react';

import Text from '@/components/Text';
import { PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { PLATFORM_META } from '@/pages/NewProject/Steps/constants';
import { getPlatformValue } from '@/utils/platform';

export type HomeStartStepProps = {
  platform: PlatformType;
  invocationName: string;
  portID: string;
};

const HomeStartStep: React.FC<HomeStartStepProps> = ({ platform, invocationName, portID }) => (
  <Step disableHighlightStyle>
    <Section>
      <Item
        icon={PLATFORM_META[platform].icon}
        iconColor={PLATFORM_META[platform].iconColor}
        label={getPlatformValue(platform, {
          [PlatformType.ALEXA]: <Text color="#132144">Alexa, open {invocationName}</Text>,
          [PlatformType.GOOGLE]: <Text color="#132144">Hey Google, start {invocationName}</Text>,
          [PlatformType.GENERAL]: <>Project starts here</>,
        })}
        labelVariant={PlatformType.GENERAL ? StepLabelVariant.SECONDARY : StepLabelVariant.PRIMARY}
        portID={portID}
      />
    </Section>
  </Step>
);

export default HomeStartStep;

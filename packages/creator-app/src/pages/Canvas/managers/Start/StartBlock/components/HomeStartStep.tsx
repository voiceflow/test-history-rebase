import { Text } from '@voiceflow/ui';
import React from 'react';

import { PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { getPlatformMeta } from '@/pages/NewProject/Steps/constants';
import { getPlatformValue } from '@/utils/platform';
import { isAnyGeneralPlatform } from '@/utils/typeGuards';

export type HomeStartStepProps = {
  platform: PlatformType;
  invocationName: string;
  portID: string;
};

const HomeStartStep: React.FC<HomeStartStepProps> = ({ platform, invocationName, portID }) => (
  <Step disableHighlightStyle>
    <Section>
      <Item
        icon={getPlatformMeta(platform).icon}
        iconColor={getPlatformMeta(platform).iconColor}
        label={getPlatformValue(
          platform,
          {
            [PlatformType.ALEXA]: <Text color="#132144">Alexa, open {invocationName}</Text>,
            [PlatformType.GOOGLE]: <Text color="#132144">Hey Google, start {invocationName}</Text>,
          },
          <>Project starts here</>
        )}
        labelVariant={isAnyGeneralPlatform(platform) ? StepLabelVariant.SECONDARY : StepLabelVariant.PRIMARY}
        portID={portID}
      />
    </Section>
  </Step>
);

export default HomeStartStep;

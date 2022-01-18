import { Constants } from '@voiceflow/general-types';
import { Text } from '@voiceflow/ui';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { getPlatformMeta } from '@/pages/NewProject/Steps/constants';
import { getPlatformValue } from '@/utils/platform';

export interface HomeStartStepProps {
  label?: string;
  portID: string;
  platform: Constants.PlatformType;
  invocationName: string;
  variant: BlockVariant;
}

const HomeStartStep: React.FC<HomeStartStepProps> = ({ label, platform, invocationName, portID, variant }) => (
  <Step disableHighlightStyle>
    <Section>
      <Item
        icon={getPlatformMeta(platform).icon}
        label={getPlatformValue(
          platform,
          {
            [Constants.PlatformType.ALEXA]: <Text color="#132144">Alexa, open {invocationName}</Text>,
            [Constants.PlatformType.GOOGLE]: <Text color="#132144">Hey Google, start {invocationName}</Text>,
          },
          <>{label || 'Project starts here'}</>
        )}
        portID={portID}
        variant={variant}
        labelVariant={StepLabelVariant.PRIMARY}
      />
    </Section>
  </Step>
);

export default HomeStartStep;

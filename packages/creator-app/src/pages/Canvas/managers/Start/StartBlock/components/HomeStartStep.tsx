import { Text } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { getPlatformMeta } from '@/pages/NewProject/Steps/constants';
import { getPlatformValue } from '@/utils/platform';

export interface HomeStartStepProps {
  label?: string;
  portID: string;
  platform: VoiceflowConstants.PlatformType;
  invocationName: string;
  variant: BlockVariant;
}

const HomeStartStep: React.FC<HomeStartStepProps> = ({ label, platform, invocationName, portID, variant }) => (
  <Step disableHighlightStyle>
    <Section>
      <Item
        icon={getPlatformMeta().icon}
        label={getPlatformValue(
          platform,
          {
            [VoiceflowConstants.PlatformType.ALEXA]: <Text color="#132144">Alexa, open {invocationName}</Text>,
            [VoiceflowConstants.PlatformType.GOOGLE]: <Text color="#132144">Hey Google, start {invocationName}</Text>,
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

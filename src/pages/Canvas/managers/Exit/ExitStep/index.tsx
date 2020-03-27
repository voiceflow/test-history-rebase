import React from 'react';

import { PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

const PLATFORM_LABELS = {
  [PlatformType.ALEXA]: 'Skill',
  [PlatformType.GOOGLE]: 'Google Action',
};

export type ExitStepProps = {
  platform: PlatformType;
};

export const ExitStep: React.FC<ExitStepProps> = ({ platform }) => (
  <Step>
    <Section>
      <Item
        label={`${PLATFORM_LABELS[platform]} ends in current state`}
        portID={null}
        labelVariant={StepLabelVariant.SECONDARY}
        icon="exit"
        iconColor="#d94c4c"
      />
    </Section>
  </Step>
);

const ConnectedExitStep: React.FC<ConnectedStepProps> = ({ platform }) => <ExitStep platform={platform} />;

export default ConnectedExitStep;

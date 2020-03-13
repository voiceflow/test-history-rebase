import React from 'react';

import { PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

const PLATFORM_LABELS = {
  [PlatformType.ALEXA]: 'Skill',
  [PlatformType.GOOGLE]: 'Google Action',
};

export type ExitStepProps = ConnectedStepProps['stepProps'] & {
  platform: PlatformType;
};

export const ExitStep: React.FC<ExitStepProps> = ({ platform, isActive, onClick }) => (
  <Step isActive={isActive} onClick={onClick}>
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

const ConnectedExitStep: React.FC<ConnectedStepProps> = ({ platform, stepProps }) => {
  return <ExitStep {...stepProps} platform={platform} />;
};

export default ConnectedExitStep;

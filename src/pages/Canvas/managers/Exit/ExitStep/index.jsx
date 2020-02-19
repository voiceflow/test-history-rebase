import React from 'react';

import { PlatformType } from '@/constants';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';

const PLATFORM_LABELS = {
  [PlatformType.ALEXA]: 'Skill',
  [PlatformType.GOOGLE]: 'Google Action',
};

const ExitStep = ({ platform, isActive }) => (
  <Step isActive={isActive}>
    <Section>
      <Item label={`${PLATFORM_LABELS[platform]} ends in current state`} withPort={false} labelVariant="secondary" icon="exit" iconColor="#d94c4c" />
    </Section>
  </Step>
);

export default ExitStep;

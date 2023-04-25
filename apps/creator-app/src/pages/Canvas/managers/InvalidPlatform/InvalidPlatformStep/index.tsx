import React from 'react';

import { useActiveProjectPlatform } from '@/hooks';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';

import { getPlatformLabel } from '../constants';

const InvalidPlatformStep: React.FC = () => {
  const platform = useActiveProjectPlatform();

  return (
    <Step>
      <Section>
        <Item icon="error" iconColor="#BD425F" placeholder={`Not supported on ${getPlatformLabel(platform)}`} />
      </Section>
    </Step>
  );
};

export default InvalidPlatformStep;

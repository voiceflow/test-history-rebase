import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { PlatformContext } from '@/pages/Project/contexts';

import { getPlatformLabel } from '../constants';

const InvalidPlatformStep: React.FC = () => {
  const platform = React.useContext(PlatformContext)!;

  return (
    <Step>
      <Section>
        <Item icon="error" iconColor="#E91E63" placeholder={`Not supported on ${getPlatformLabel(platform)}`} />
      </Section>
    </Step>
  );
};

export default InvalidPlatformStep;

import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';
import { createPlatformSelector } from '@/utils/platform';

import { NODE_CONFIG } from '../constants';

const getPlatformLabel = createPlatformSelector(
  {
    [Platform.Constants.PlatformType.ALEXA]: 'Skill',
    [Platform.Constants.PlatformType.GOOGLE]: 'Google Action',
  },
  'Agent'
);

const ExitStep: ConnectedStep = ({ data, platform, palette }) => (
  <Step nodeID={data.nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={`${getPlatformLabel(platform)} ends in current state`}
        portID={null}
        palette={palette}
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

export default ExitStep;

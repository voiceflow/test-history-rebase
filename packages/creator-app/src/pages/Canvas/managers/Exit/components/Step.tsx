import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { createPlatformSelector } from '@/utils/platform';

import { NODE_CONFIG } from '../constants';

const getPlatformLabel = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 'Skill',
    [VoiceflowConstants.PlatformType.GOOGLE]: 'Google Action',
  },
  'Project'
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

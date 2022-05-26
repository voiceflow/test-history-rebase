import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';
import { createPlatformSelector } from '@/utils/platform';

import { NODE_CONFIG } from '../constants';

const getPlatformLabel = createPlatformSelector(
  {
    [VoiceflowConstants.PlatformType.ALEXA]: 'Skill',
    [VoiceflowConstants.PlatformType.GOOGLE]: 'Google Action',
  },
  'Project'
);

export interface ExitStepProps {
  nodeID: string;
  platform: VoiceflowConstants.PlatformType;
  palette: HSLShades;
}

export const ExitStep: React.FC<ExitStepProps> = ({ nodeID, platform, palette }) => (
  <Step nodeID={nodeID}>
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

const ConnectedExitStep: ConnectedStep = ({ data, platform, palette }) => <ExitStep nodeID={data.nodeID} platform={platform} palette={palette} />;

export default ConnectedExitStep;

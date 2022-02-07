import { Constants } from '@voiceflow/general-types';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';
import { createPlatformSelector } from '@/utils/platform';

import { NODE_CONFIG } from '../constants';

const getPlatformLabel = createPlatformSelector(
  {
    [Constants.PlatformType.ALEXA]: 'Skill',
    [Constants.PlatformType.GOOGLE]: 'Google Action',
  },
  'Project'
);

export interface ExitStepProps {
  nodeID: string;
  platform: Constants.PlatformType;
  variant: BlockVariant;
}

export const ExitStep: React.FC<ExitStepProps> = ({ nodeID, platform, variant }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={`${getPlatformLabel(platform)} ends in current state`}
        portID={null}
        variant={variant}
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedExitStep: ConnectedStep = ({ data, platform, variant }) => <ExitStep nodeID={data.nodeID} platform={platform} variant={variant} />;

export default ConnectedExitStep;

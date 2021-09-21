import { Constants } from '@voiceflow/general-types';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
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
}

export const ExitStep: React.FC<ExitStepProps> = ({ nodeID, platform }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={`${getPlatformLabel(platform)} ends in current state`}
        portID={null}
        iconColor={NODE_CONFIG.iconColor}
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedExitStep: React.FC<ConnectedStepProps> = ({ node, platform }) => <ExitStep nodeID={node.id} platform={platform} />;

export default ConnectedExitStep;

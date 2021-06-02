import React from 'react';

import { PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { createPlatformSelector } from '@/utils/platform';

import { NODE_CONFIG } from '../constants';

const getPlatformLabel = createPlatformSelector(
  {
    [PlatformType.ALEXA]: 'Skill',
    [PlatformType.GOOGLE]: 'Google Action',
  },
  'Project'
);

export type ExitStepProps = {
  nodeID: string;
  platform: PlatformType;
};

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

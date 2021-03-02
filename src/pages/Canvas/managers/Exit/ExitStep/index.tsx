import React from 'react';

import { PlatformType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

const PLATFORM_LABELS = {
  [PlatformType.ALEXA]: 'Skill',
  [PlatformType.GOOGLE]: 'Google Action',
  [PlatformType.GENERAL]: 'Project',
};

export type ExitStepProps = {
  nodeID: string;
  platform: PlatformType;
};

export const ExitStep: React.FC<ExitStepProps> = ({ nodeID, platform }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={`${PLATFORM_LABELS[platform]} ends in current state`}
        portID={null}
        iconColor={NODE_CONFIG.iconColor}
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedExitStep: React.FC<ConnectedStepProps> = ({ node, platform }) => <ExitStep nodeID={node.id} platform={platform} />;

export default ConnectedExitStep;

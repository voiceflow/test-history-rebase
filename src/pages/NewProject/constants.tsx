import React from 'react';

import { PlatformType } from '@/constants';
import { CHANNEL_META, PLATFORM_META } from '@/pages/NewProject/Steps/constants';

import ChannelSelect from './Steps/ChannelSelect';
import NameAndImage from './Steps/NameAndImage';
import ProjectSettings from './Steps/ProjectSettings';

export enum StepID {
  NAME_AND_IMAGE = 'name_and_image',
  PLATFORM_SELECT = 'platform_select',
  PROJECT_SETTINGS = 'project_settings',
}

type StepMetaProps = {
  title: (platform: PlatformType) => string;
  component: React.FC<any>;
};

export const StepMeta: Record<StepID, StepMetaProps> = {
  [StepID.NAME_AND_IMAGE]: {
    title: () => 'New Project',
    component: NameAndImage,
  },
  [StepID.PLATFORM_SELECT]: {
    title: () => 'Select Channel',
    component: ({ setSelectedPlatform, creatingSkill }) => (
      <ChannelSelect onSelect={(channel) => setSelectedPlatform(channel ? CHANNEL_META[channel].platform : null)} isLoading={creatingSkill} />
    ),
  },
  [StepID.PROJECT_SETTINGS]: {
    title: (platform) => `${PLATFORM_META[platform].platformAppType} Settings`,
    component: ProjectSettings,
  },
};

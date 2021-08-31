import { PlatformType } from '@voiceflow/internal';
import React from 'react';

import { getPlatformMeta } from '@/pages/NewProject/Steps/constants';

import ChannelSelect from './Steps/ChannelSelect';
import NameAndImage from './Steps/NameAndImage';
import ProjectSettings from './Steps/ProjectSettings';

export enum StepID {
  NAME_AND_IMAGE = 'name_and_image',
  PLATFORM_SELECT = 'platform_select',
  PROJECT_SETTINGS = 'project_settings',
}

interface StepMetaProps {
  title: (platform: PlatformType) => string;
  component: React.FC<any>;
}

export const StepMeta: Record<StepID, StepMetaProps> = {
  [StepID.NAME_AND_IMAGE]: {
    title: () => 'New Project',
    component: NameAndImage,
  },
  [StepID.PLATFORM_SELECT]: {
    title: () => 'Project Type',
    component: ({ setSelectedChannel, creatingSkill }) => (
      <ChannelSelect onSelect={(platform) => setSelectedChannel(platform)} isLoading={creatingSkill} />
    ),
  },
  [StepID.PROJECT_SETTINGS]: {
    title: (platform) => `${getPlatformMeta(platform).platformAppType} Settings`,
    component: ProjectSettings,
  },
};

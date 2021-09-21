import { Constants } from '@voiceflow/general-types';
import React from 'react';

import { getPlatformMeta } from '@/pages/NewProject/Steps/constants';

import ChannelSelect from './Steps/ChannelSelect';
import ProjectSettings from './Steps/ProjectSettings';

export enum StepID {
  PLATFORM_SELECT = 'platform_select',
  PROJECT_SETTINGS = 'project_settings',
}

interface StepMetaProps {
  title: (platform: Constants.PlatformType) => string;
  component: React.FC<any>;
}

export const PROJECT_CREATION_STEPS_NUMBER = Object.values(StepID).length;

export const DEFAULT_PROJECT_NAME = 'Untitled';

export const StepMeta: Record<StepID, StepMetaProps> = {
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

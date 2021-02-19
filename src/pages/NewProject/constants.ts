import React from 'react';

import { PlatformType } from '@/constants';
import { PLATFORM_META } from '@/pages/NewProject/Steps/constants';

import NameAndImage from './Steps/NameAndImage';
import PlatformSelect from './Steps/PlatformSelect';
import ProjectSettings from './Steps/ProjectSettings';

export enum StepID {
  NAME_AND_IMAGE = 'name_and_image',
  PLATFORM_SELECT = 'platform_select',
  PROJECT_SETTINGS = 'project_settings',
}

type StepMetaProps = {
  title: (platform?: PlatformType) => string;
  component: React.FC<any>;
};

export const StepMeta = <Record<StepID, StepMetaProps>>{
  [StepID.NAME_AND_IMAGE]: {
    title: () => 'New Project',
    component: NameAndImage,
  },
  [StepID.PLATFORM_SELECT]: {
    title: () => 'Select Channel',
    component: PlatformSelect,
  },
  [StepID.PROJECT_SETTINGS]: {
    title: (platform: PlatformType) => `${PLATFORM_META[platform].platformAppType} Settings`,
    component: ProjectSettings,
  },
};

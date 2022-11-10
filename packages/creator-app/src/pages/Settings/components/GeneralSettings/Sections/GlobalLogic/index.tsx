import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';

import NoMatchNoReply from './NoMatchNoReply';

interface GeneralSettingsSectionsGlobalLogicProps {
  platform: Platform.Constants.PlatformType;
  projectType: Platform.Constants.ProjectType;
  platformMeta: PlatformSettingsMetaProps;
}

const GeneralSettingsSectionsGlobalLogic: React.FC<GeneralSettingsSectionsGlobalLogicProps> = ({ platform, projectType, platformMeta }) => {
  return <NoMatchNoReply platform={platform} projectType={projectType} platformMeta={platformMeta} />;
};

export default GeneralSettingsSectionsGlobalLogic;

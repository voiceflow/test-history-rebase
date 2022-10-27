import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';

import NoMatchNoReply from './NoMatchNoReply';

interface GeneralSettingsSectionsGlobalLogicProps {
  platform: VoiceflowConstants.PlatformType;
  projectType: VoiceflowConstants.ProjectType;
  platformMeta: PlatformSettingsMetaProps;
}

const GeneralSettingsSectionsGlobalLogic: React.FC<GeneralSettingsSectionsGlobalLogicProps> = ({ platform, projectType, platformMeta }) => {
  return <NoMatchNoReply platform={platform} projectType={projectType} platformMeta={platformMeta} />;
};

export default GeneralSettingsSectionsGlobalLogic;

import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Utils } from '@voiceflow/realtime-sdk';
import React from 'react';

import { SectionVariants, SettingsSection } from '@/components/Settings';
import { useFeature } from '@/hooks';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';

import { DefaultTTS, MessageDelay, NoMatchNoReply } from './components';

interface GeneralSettingsSectionsGlobalLogicProps {
  platform: Platform.Constants.PlatformType;
  projectType: Platform.Constants.ProjectType;
  platformMeta: PlatformSettingsMetaProps;
}

const GeneralSettingsSectionsGlobalLogic: React.FC<GeneralSettingsSectionsGlobalLogicProps> = ({ platform, projectType, platformMeta }) => {
  const globalNoMatchNoReply = useFeature(Realtime.FeatureFlag.GLOABL_NO_MATCH_NO_REPLY);
  const showMessageDelaySetting = Utils.typeGuards.isChatProjectType(projectType);
  const showTTSSettings =
    Utils.typeGuards.isVoiceProjectType(projectType) &&
    !Utils.typeGuards.isDialogflowPlatform(platform) &&
    !Utils.typeGuards.isDialogflowCXPlatform(platform);

  return (
    <>
      {showMessageDelaySetting && (
        <SettingsSection variant={SectionVariants.PRIMARY} marginBottom={16} title="Global Logic">
          <MessageDelay />
        </SettingsSection>
      )}
      {showTTSSettings && (
        <SettingsSection
          variant={SectionVariants.PRIMARY}
          marginBottom={globalNoMatchNoReply ? 16 : 40}
          title={showMessageDelaySetting ? '' : 'Global Logic'}
        >
          <DefaultTTS platform={platform} projectType={projectType} platformMeta={platformMeta} />
        </SettingsSection>
      )}
      {globalNoMatchNoReply && (
        <SettingsSection variant={SectionVariants.PRIMARY} marginBottom={40} title={showMessageDelaySetting || showTTSSettings ? '' : 'Global Logic'}>
          <NoMatchNoReply />
        </SettingsSection>
      )}
    </>
  );
};

export default GeneralSettingsSectionsGlobalLogic;

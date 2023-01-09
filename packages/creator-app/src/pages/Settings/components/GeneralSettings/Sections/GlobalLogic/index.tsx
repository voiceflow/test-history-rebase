import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Utils } from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
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

  if (!globalNoMatchNoReply.isEnabled && !showMessageDelaySetting && !showTTSSettings) return null;

  return (
    <Settings.Section title="Global Logic">
      <Settings.Card>
        {showMessageDelaySetting && <MessageDelay />}

        {showTTSSettings && <DefaultTTS platform={platform} projectType={projectType} platformMeta={platformMeta} />}

        {globalNoMatchNoReply.isEnabled && (
          <>
            {(showMessageDelaySetting || showTTSSettings) && <SectionV2.Divider />}

            <NoMatchNoReply />
          </>
        )}
      </Settings.Card>
    </Settings.Section>
  );
};

export default GeneralSettingsSectionsGlobalLogic;

import type * as Platform from '@voiceflow/platform-config';
import { Utils } from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import type { PlatformSettingsMetaProps } from '@/pages/Settings/constants';

import { DefaultTTS, MessageDelay, NLUSettings, NoMatchNoReply } from './components';

interface GeneralSettingsSectionsGlobalLogicProps {
  platform: Platform.Constants.PlatformType;
  projectType: Platform.Constants.ProjectType;
  platformMeta: PlatformSettingsMetaProps;
}

const GeneralSettingsSectionsGlobalLogic: React.FC<GeneralSettingsSectionsGlobalLogicProps> = ({
  platform,
  projectType,
  platformMeta,
}) => {
  const showMessageDelaySetting = Utils.typeGuards.isChatProjectType(projectType);
  const showTTSSettings = Utils.typeGuards.isVoiceProjectType(projectType);

  return (
    <Settings.Section title="Global Logic">
      <Settings.Card>
        <NLUSettings />

        <SectionV2.Divider />

        {showMessageDelaySetting && <MessageDelay />}

        {showTTSSettings && <DefaultTTS platform={platform} projectType={projectType} platformMeta={platformMeta} />}

        {(showMessageDelaySetting || showTTSSettings) && <SectionV2.Divider />}

        <NoMatchNoReply />
      </Settings.Card>
    </Settings.Section>
  );
};

export default GeneralSettingsSectionsGlobalLogic;

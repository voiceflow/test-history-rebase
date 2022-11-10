import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Select } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useDispatch, useFeature, useSelector } from '@/hooks';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { getPlatformVoiceOptions, prettifyVoice } from '@/utils/voice';

import AssistantConversationLogic from './AssistantConversationLogic';

interface GlobalConversationLogicProps {
  platform: Platform.Constants.PlatformType;
  projectType: Platform.Constants.ProjectType;
  platformMeta: PlatformSettingsMetaProps;
}

const GlobalConversationLogic: React.FC<GlobalConversationLogicProps> = ({ platform, projectType, platformMeta }) => {
  const projectConfig = useActiveProjectTypeConfig();

  const wavenetVoices = useFeature(Realtime.FeatureFlag.WAVENET_VOICES);

  const locales = useSelector(VersionV2.active.localesSelector);
  const defaultVoiceStore = useSelector(VersionV2.active.defaultVoiceSelector);

  const updateDefaultVoice = useDispatch(Version.updateDefaultVoice);

  const voiceOptions = React.useMemo(
    () => getPlatformVoiceOptions(platform, { locales, useWavenet: !!wavenetVoices.isEnabled }),
    [locales, platform, wavenetVoices.isEnabled]
  );
  const defaultVoice = defaultVoiceStore || projectConfig.project.voice.default;

  const { descriptors } = platformMeta;

  const assistantLogic = (
    <AssistantConversationLogic
      platform={platform}
      projectType={projectType}
      platformMeta={platformMeta}
      defaultVoice={defaultVoice}
      platformDefaultVoice={projectConfig.project.voice.default}
    />
  );

  return (
    <>
      <Section
        header="Default Voice"
        variant={SectionVariant.QUATERNARY}
        dividers={false}
        contentSuffix={descriptors.defaultVoice}
        customContentStyling={{ paddingBottom: '24px' }}
      >
        <Select
          value={defaultVoice}
          options={voiceOptions}
          onSelect={updateDefaultVoice}
          autoWidth={false}
          fullWidth={false}
          searchable
          placeholder={defaultVoice}
          isMultiLevel
          getOptionKey={(option) => option.value ?? option.label}
          getOptionValue={(option) => (option?.value ?? null) as Realtime.AnyVoice | null}
          getOptionLabel={(value) => prettifyVoice(value ?? '')}
          renderOptionLabel={(option) => option.label || option.value}
        />
      </Section>

      {Realtime.Utils.typeGuards.isVoiceProjectType(projectType) &&
        Realtime.Utils.platform.createPlatformSelector(
          {
            [Platform.Constants.PlatformType.ALEXA]: assistantLogic,
            [Platform.Constants.PlatformType.GOOGLE]: assistantLogic,
            [Platform.Constants.PlatformType.DIALOGFLOW_ES]: assistantLogic,
          },
          <></>
        )(platform)}
    </>
  );
};

export default GlobalConversationLogic;

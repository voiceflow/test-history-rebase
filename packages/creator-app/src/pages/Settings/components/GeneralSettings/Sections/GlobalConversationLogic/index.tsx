import * as Realtime from '@voiceflow/realtime-sdk';
import { Select } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useFeature, useSelector } from '@/hooks';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { getPlatformDefaultVoice } from '@/utils/platform';
import { getPlatformVoiceOptions, prettifyVoice } from '@/utils/voice';

import AssistantConversationLogic from './AssistantConversationLogic';

interface GlobalConversationLogicProps {
  platform: VoiceflowConstants.PlatformType;
  projectType: VoiceflowConstants.ProjectType;
  platformMeta: PlatformSettingsMetaProps;
}

const GlobalConversationLogic: React.FC<GlobalConversationLogicProps> = ({ platform, projectType, platformMeta }) => {
  const wavenetVoices = useFeature(Realtime.FeatureFlag.WAVENET_VOICES);

  const locales = useSelector(VersionV2.active.localesSelector);
  const defaultVoiceStore = useSelector(VersionV2.active.defaultVoiceSelector);

  const updateDefaultVoice = useDispatch(Version.updateDefaultVoice);

  const voiceOptions = React.useMemo(
    () => getPlatformVoiceOptions(platform, { locales, useWavenet: !!wavenetVoices.isEnabled }),
    [locales, platform, wavenetVoices.isEnabled]
  );
  const platformDefaultVoice = getPlatformDefaultVoice(platform);
  const defaultVoice = defaultVoiceStore || platformDefaultVoice;

  const { descriptors } = platformMeta;

  const assistantLogic = (
    <AssistantConversationLogic
      platform={platform}
      projectType={projectType}
      platformMeta={platformMeta}
      defaultVoice={defaultVoice}
      platformDefaultVoice={platformDefaultVoice}
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
            [VoiceflowConstants.PlatformType.ALEXA]: assistantLogic,
            [VoiceflowConstants.PlatformType.GOOGLE]: assistantLogic,
            [VoiceflowConstants.PlatformType.DIALOGFLOW_ES]: assistantLogic,
          },
          <></>
        )(platform)}
    </>
  );
};

export default GlobalConversationLogic;

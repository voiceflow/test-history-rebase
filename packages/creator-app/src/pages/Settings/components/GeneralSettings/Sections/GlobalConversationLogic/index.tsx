import { Constants } from '@voiceflow/general-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Select } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { FeatureFlag } from '@/config/features';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useFeature, useSelector } from '@/hooks';
import { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { getPlatformDefaultVoice, getPlatformValue } from '@/utils/platform';
import { getPlatformVoiceOptions, prettifyVoice } from '@/utils/voice';

import { AssistantConversationLogic } from './components';

interface GlobalConversationLogicProps {
  platform: Constants.PlatformType;
  platformMeta: PlatformSettingsMetaProps;
}

const GlobalConversationLogic: React.FC<GlobalConversationLogicProps> = ({ platform, platformMeta }) => {
  const wavenetVoices = useFeature(FeatureFlag.WAVENET_VOICES);

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
          getOptionValue={(option) => (option?.value ?? null) as Realtime.AnyVoice | null}
          getOptionLabel={(value) => prettifyVoice(value ?? '')}
          renderOptionLabel={(option) => option.label || option.value}
          multiLevelDropdown
        />
      </Section>

      {getPlatformValue(
        platform,
        {
          [Constants.PlatformType.ALEXA]: assistantLogic,
          [Constants.PlatformType.GOOGLE]: assistantLogic,
          [Constants.PlatformType.DIALOGFLOW_ES_VOICE]: assistantLogic,
        },
        <></>
      )}
    </>
  );
};

export default GlobalConversationLogic;

import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Select } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import * as VersionV2 from '@/ducks/versionV2';
import { useActiveProjectTypeConfig, useDispatch, useHasPremiumVoice, useSelector } from '@/hooks';
import type { PlatformSettingsMetaProps } from '@/pages/Settings/constants';
import { getPlatformVoiceOptions, prettifyVoice } from '@/utils/voice';

import AssistantConversationLogic from './AssistantConversationLogic';

interface DefaultTTSProps {
  platform: Platform.Constants.PlatformType;
  projectType: Platform.Constants.ProjectType;
  platformMeta: PlatformSettingsMetaProps;
}

const DefaultTTS: React.FC<DefaultTTSProps> = ({ platform, projectType, platformMeta }) => {
  const projectConfig = useActiveProjectTypeConfig();
  const { hasPremiumVoice } = useHasPremiumVoice();

  const locales = useSelector(VersionV2.active.localesSelector);
  const defaultVoice = useSelector(VersionV2.active.voice.defaultVoiceSelector);

  const updateDefaultVoice = useDispatch(VersionV2.voice.updateDefaultVoice);
  const voiceOptions = React.useMemo(
    () => getPlatformVoiceOptions(platform, { locales, usePremiumVoice: !!hasPremiumVoice }),
    [locales, platform, hasPremiumVoice]
  );

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
      <Settings.SubSection header="Default TTS" splitView>
        <Select
          value={defaultVoice}
          options={voiceOptions}
          onSelect={updateDefaultVoice}
          autoWidth={false}
          fullWidth
          searchable
          placeholder={defaultVoice}
          isMultiLevel
          getOptionKey={(option) => option.value ?? option.label}
          getOptionValue={(option) => option?.value ?? null}
          getOptionLabel={(value) => prettifyVoice(value ?? '')}
          renderOptionLabel={(option) => option.label || option.value}
        />

        <Settings.SubSection.Description>{descriptors.defaultVoice}</Settings.SubSection.Description>
      </Settings.SubSection>

      {Realtime.Utils.typeGuards.isVoiceProjectType(projectType) &&
        Realtime.Utils.platform.createPlatformSelector(
          {
            [Platform.Constants.PlatformType.ALEXA]: assistantLogic,
            [Platform.Constants.PlatformType.GOOGLE]: assistantLogic,
          },
          <></>
        )(platform)}
    </>
  );
};

export default DefaultTTS;

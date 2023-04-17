import { useTheme } from '@voiceflow/react-chat';
import { Box } from '@voiceflow/ui';
import React from 'react';

import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';

import PrivacyToggle from './PrivacyToggle';
import { AppearanceSection, GeneralSection, PreviewSection, PublishSection } from './sections';
import * as S from './styles';

const Webchat: React.FC = () => {
  const config = useSelector(VersionV2.active.voiceflow.chat.publishingSelector);
  const updateConfig = useDispatch(Version.voiceflow.chat.patchActiveAndLivePublishing);

  React.useEffect(() => {
    // apply default values, this is a temporary hack
    updateConfig(config);
  }, []);

  const theme = useTheme(config);

  return (
    <Box display="flex" minHeight="100%" className={theme}>
      <PrivacyToggle />

      <S.SettingsContainer>
        <PublishSection />

        <GeneralSection />

        <AppearanceSection />
      </S.SettingsContainer>

      <S.PreviewContainer>
        <PreviewSection />
      </S.PreviewContainer>
    </Box>
  );
};

export default Webchat;

import { theme, useTheme } from '@voiceflow/react-chat';
import { Box } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import * as VersionV2 from '@/ducks/versionV2';
import { useSelector } from '@/hooks';

import PrivacyToggle from './PrivacyToggle';
import { AppearanceSection, GeneralSection, PreviewSection, PublishSection } from './sections';
import * as S from './styles';

const Webchat: React.FC = () => {
  const config = useSelector(VersionV2.active.voiceflow.chat.publishingSelector);

  const customTheme = useTheme(config);

  return (
    <Box display="flex" minHeight="100%" className={cn(theme, customTheme)}>
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

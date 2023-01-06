import { useTheme } from '@voiceflow/react-chat';
import { Box } from '@voiceflow/ui';
import React from 'react';

import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';

import PrivacyToggle from './PrivacyToggle';
import { ApperanceSection, GeneralSection, PreviewSection, PublishSection } from './sections';
import { PreviewContainer, SettingsContainer } from './styled';

const Webchat: React.OldFC = () => {
  const config = useSelector(VersionV2.active.voiceflow.chat.publishingSelector);
  const updateConfig = useDispatch(Version.voiceflow.chat.patchActiveAndLivePublishing);

  React.useEffect(() => {
    // apply default values, this is a temporary hack
    updateConfig(config);
  }, []);

  const theme = useTheme(config);

  return (
    <Box display="flex" height="100%" className={theme}>
      <PrivacyToggle />
      <SettingsContainer>
        <PublishSection />
        <GeneralSection />
        <ApperanceSection />
      </SettingsContainer>
      <PreviewContainer>
        <PreviewSection />
      </PreviewContainer>
    </Box>
  );
};

export default Webchat;

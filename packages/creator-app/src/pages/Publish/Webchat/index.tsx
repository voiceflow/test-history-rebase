import { useTheme } from '@voiceflow/react-chat';
import { Box } from '@voiceflow/ui';
import React from 'react';

import { patchActiveAndLivePublishing } from '@/ducks/version/platform/general';
import * as Version from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';

import PrivacyToggle from './PrivacyToggle';
import { ApperanceSection, GeneralSection, PreviewSection, PublishSection } from './sections';
import { PreviewContainer, SettingsContainer } from './styled';

const Webchat: React.FC = () => {
  const config = useSelector(Version.active.general.chatPublishingSelector);
  const updateConfig = useDispatch(patchActiveAndLivePublishing);

  React.useEffect(() => {
    // apply default values, this is a temporary hack
    updateConfig(config, false);
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

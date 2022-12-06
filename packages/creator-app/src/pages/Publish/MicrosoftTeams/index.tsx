import { Banner } from '@voiceflow/ui';
import React from 'react';

import { SettingsContainer, WebhookField } from '@/pages/Publish/components';

const MicrosoftTeams: React.FC = () => (
  <SettingsContainer>
    <Banner
      title="Publishing to Microsoft Teams"
      subtitle="Make your assistant instantly accessible on Microsoft Teams."
      buttonText="Documentation"
      isCloseable={false}
    />
    <WebhookField platformName="ms-teams" />
  </SettingsContainer>
);

export default MicrosoftTeams;

import React from 'react';

import { PublishBanner, SettingsContainer, WebhookField } from '@/pages/Publish/components';

const MicrosoftTeams: React.FC = () => (
  <SettingsContainer>
    <PublishBanner
      title="Publishing to Microsoft Teams"
      description="Make your assistant instantly accessible on Microsoft Teams."
      docUrl="https://www.voiceflow.com/"
    />
    <WebhookField platformName="ms-teams" />
  </SettingsContainer>
);

export default MicrosoftTeams;

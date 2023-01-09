import React from 'react';

import * as Settings from '@/components/Settings';

import { AmazonIntegration, GoogleIntegration } from './Sections';

const AccountIntegrationsSection: React.FC = () => (
  <Settings.PageContent>
    <Settings.Section title="Channel Integrations">
      <Settings.Card>
        <AmazonIntegration />
      </Settings.Card>
    </Settings.Section>

    <Settings.Section>
      <Settings.Card>
        <GoogleIntegration />
      </Settings.Card>
    </Settings.Section>
  </Settings.PageContent>
);

export default AccountIntegrationsSection;

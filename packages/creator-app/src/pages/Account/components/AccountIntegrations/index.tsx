import { Box } from '@voiceflow/ui';
import React from 'react';

import { SectionVariants, SettingsSection } from '@/components/Settings';
import { DEFAULT_MAX_WIDTH } from '@/pages/Settings/constants';

import { AmazonIntegration, GoogleIntegration } from './Sections';

const AccountIntegrationsSection: React.OldFC = () => {
  return (
    <Box maxWidth={DEFAULT_MAX_WIDTH}>
      <SettingsSection variant={SectionVariants.PRIMARY} title="Channel Integrations">
        <AmazonIntegration />
      </SettingsSection>
      <SettingsSection variant={SectionVariants.PRIMARY}>
        <GoogleIntegration />
      </SettingsSection>
    </Box>
  );
};

export default AccountIntegrationsSection;

import { Box } from '@voiceflow/ui';
import React from 'react';

import { SectionVariants, SettingsSection } from '@/components/Settings';
import { DEFAULT_MAX_WIDTH } from '@/pages/Settings/constants';

import { AccountProfile } from './Sections';

const AccountProfileSection: React.OldFC = () => {
  return (
    <Box maxWidth={DEFAULT_MAX_WIDTH}>
      <SettingsSection variant={SectionVariants.PRIMARY} title="Profile">
        <AccountProfile />
      </SettingsSection>
    </Box>
  );
};

export default AccountProfileSection;

import React from 'react';

import * as Settings from '@/components/Settings';

import { AccountProfile } from './Sections';

const AccountProfileSection: React.FC = () => (
  <Settings.PageContent>
    <Settings.Section title="Profile">
      <Settings.Card>
        <AccountProfile />
      </Settings.Card>
    </Settings.Section>
  </Settings.PageContent>
);

export default AccountProfileSection;

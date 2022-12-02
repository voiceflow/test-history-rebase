import React from 'react';

import NavLinkSidebar from '@/components/NavLinkSidebar';
import { Path } from '@/config/routes';

const AccountSidebar: React.FC = () => (
  <NavLinkSidebar
    items={[
      { to: Path.ACCOUNT_PROFILE, key: 'profile', label: 'Profile' },
      { to: Path.ACCOUNT_INTEGRATIONS, key: 'integrations', label: 'Integrations' },
    ]}
  />
);

export default AccountSidebar;

import React from 'react';

import NavLinkSidebar, { NavLinkItem } from '@/components/NavLinkSidebar';
import { Path } from '@/config/routes';

const AccountSidebar: React.FC = () => {
  const items = React.useMemo<NavLinkItem[]>(() => {
    return [
      { to: Path.ACCOUNT_PROFILE, key: 'profile', label: 'Profile' },
      { to: Path.ACCOUNT_INTEGRATIONS, key: 'integrations', label: 'Integrations' },
    ];
  }, []);

  return <NavLinkSidebar items={items} />;
};

export default AccountSidebar;

import React from 'react';

import NavLinkSidebar, { NavLinkItem } from '@/components/NavLinkSidebar';
import { FeatureFlag } from '@/config/features';
import { Path } from '@/config/routes';
import { useFeature } from '@/hooks';

const AccountSidebar: React.FC = () => {
  const isAccountPageRedesign = useFeature(FeatureFlag.ACCOUNT_PAGE_REDESIGN)?.isEnabled;

  const items = React.useMemo<NavLinkItem[]>(() => {
    return isAccountPageRedesign
      ? [
          { to: Path.ACCOUNT_PROFILE, key: 'profile', label: 'Profile' },
          { to: Path.ACCOUNT_INTEGRATIONS, key: 'integrations', label: 'Integrations' },
        ]
      : [];
  }, []);

  return <NavLinkSidebar items={items} />;
};

export default AccountSidebar;

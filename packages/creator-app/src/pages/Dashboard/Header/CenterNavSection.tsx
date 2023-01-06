import React from 'react';

import OrganizationTrialCountdown from './components/OrganizationTrialCountdown';
import UpgradeButton from './UpgradeButton';

const CenterNavSection: React.OldFC = () => {
  return (
    <>
      <UpgradeButton />
      <OrganizationTrialCountdown />
    </>
  );
};

export default CenterNavSection;

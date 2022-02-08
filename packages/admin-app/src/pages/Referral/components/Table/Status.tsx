import { ConnectedProps } from '@voiceflow/ui';
import React from 'react';

import Dropdown from '@/components/Dropdown';
import { Option } from '@/constants';
import * as Referrals from '@/ducks/referral';
import { connect } from '@/hocs';

export interface StatusProps {
  status: boolean;
  referralCode?: string;
}

const Status: React.FC<StatusProps & ConnectStatusProps> = ({ status, referralCode = '', updateReferral }) => {
  const setActive = () => updateReferral({ status: true, code: referralCode });

  const setInactive = () => updateReferral({ status: false, code: referralCode });

  return (
    <Dropdown
      options={[
        {
          label: Option.ACTIVE,
          onClick: setActive,
        },
        {
          label: Option.INACTIVE,
          onClick: setInactive,
        },
      ]}
      value={status ? Option.ACTIVE : Option.INACTIVE}
      noBorder
    />
  );
};

const mapDispatchToProps = {
  updateReferral: Referrals.updateReferral,
};

export type ConnectStatusProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(Status) as React.FC<StatusProps>;

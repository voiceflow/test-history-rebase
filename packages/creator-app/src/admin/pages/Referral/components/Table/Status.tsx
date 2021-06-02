import React from 'react';

import Dropdown from '@/admin/components/Dropdown';
import { Option } from '@/admin/constants';
import * as Referrals from '@/admin/store/ducks/referral';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

export type StatusProps = {
  status: boolean;
  referralCode?: string;
};

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

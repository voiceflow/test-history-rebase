import React, { useContext } from 'react';

import Dropdown from '@/admin/components/Dropdown';
import { Option } from '@/admin/constants';
import { ReferralContext } from '@/admin/pages/Referral/context';
import Box from '@/components/Box';

import FormSection from './FormSection';

const Status: React.FC = () => {
  const { state, actions } = useContext(ReferralContext)!;

  const onChange = (status: Option) => actions.update({ status: status === Option.ACTIVE });

  return (
    <FormSection label="Status" labelFor="status">
      <Box width={100}>
        <Dropdown
          options={[
            {
              label: Option.ACTIVE,
              onClick: () => onChange(Option.ACTIVE),
            },
            {
              label: Option.INACTIVE,
              onClick: () => onChange(Option.INACTIVE),
            },
          ]}
          value={state.status ? Option.ACTIVE : Option.INACTIVE}
        />
      </Box>
    </FormSection>
  );
};

export default Status;

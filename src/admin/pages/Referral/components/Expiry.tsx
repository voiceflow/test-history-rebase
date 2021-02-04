import React, { useContext } from 'react';

import DatePicker from '@/admin/components/DatePicker';
import Box from '@/components/Box';

import { ReferralContext } from '../context';
import FormSection from './FormSection';

const Expiry: React.FC = () => {
  const { state, actions } = useContext(ReferralContext)!;

  const onChange = (expiry: string | Date) => actions.update({ expiry });

  return (
    <Box style={{ cursor: state.coupon ? 'default' : 'not-allowed' }}>
      <Box style={{ pointerEvents: state.coupon ? 'auto' : 'none' }}>
        <FormSection label="Expire at" labelFor="expiry">
          <DatePicker date={state.expiry} onChange={onChange} addOffSet={719} addOffSetBy="m" />
        </FormSection>
      </Box>
    </Box>
  );
};

export default Expiry;

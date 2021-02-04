import React, { useContext } from 'react';

import Box from '@/components/Box';
import Input from '@/components/Input';

import { ReferralContext } from '../context';
import FormSection from './FormSection';

const RedemptionLimit: React.FC = () => {
  const { state, actions } = useContext(ReferralContext)!;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => actions.update({ redemptionLimit: parseInt(e.target.value, 10) });

  return (
    <Box style={{ cursor: state.coupon ? 'default' : 'not-allowed' }}>
      <FormSection label="Redemption Limit" labelFor="redemption">
        <Input
          name="redemption"
          value={state.redemptionLimit || ''}
          placeholder="e.g. 3"
          onChange={onChange}
          type="number"
          disabled={!state.coupon}
        />
      </FormSection>
    </Box>
  );
};

export default RedemptionLimit;

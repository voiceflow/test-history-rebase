import React, { useContext } from 'react';

import Input from '@/components/Input';

import { ReferralContext } from '../context';
import FormSection from './FormSection';

const Creator: React.FC = () => {
  const { state, actions } = useContext(ReferralContext)!;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => actions.update({ creatorID: parseInt(e.target.value, 10) });

  return (
    <FormSection label="Creator ID" labelFor="creator">
      <Input name="creator" value={state.creatorID || ''} placeholder="0000" onChange={onChange} type="number" />
    </FormSection>
  );
};

export default Creator;

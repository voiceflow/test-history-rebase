import { Box, Input, useEnableDisable } from '@voiceflow/ui';
import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';

import { ReferralContext } from '../context';
import FormSection from './FormSection';

const ALPHA_NUMERIC = /^[\da-z]+$/i;

const Code: React.FC = () => {
  const { state, actions } = useContext(ReferralContext)!;
  const [error, setError, resetError] = useEnableDisable(false);
  const theme = React.useContext(ThemeContext) as any;

  const onChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (value.match(ALPHA_NUMERIC)) {
      resetError();
    } else {
      setError();
    }
    actions.update({ code: value });
  };

  return (
    <FormSection
      label="Code"
      labelFor="code"
      mandatory
      tooltip="If no Creator ID is associated with this code, it cannot be used as Referral Code for signup."
    >
      <Input name="code" value={state.code} placeholder="CODE (up to 30 characters)" onChange={onChange} maxLength={30} error={error} />
      {error && (
        <Box fontSize={12} color={theme.palette.error.main}>
          Only alpha-numeric characters allowed
        </Box>
      )}
    </FormSection>
  );
};

export default Code;

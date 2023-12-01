import { Box, TextField } from '@voiceflow/ui-next';
import React from 'react';

import { useInput } from '@/hooks/input.hook';

import type { ICMSFormName } from './CMSFormName.interface';

export const CMSFormName: React.FC<ICMSFormName> = ({ error, value, autoFocus, disabled, transform, placeholder, onValueChange }) => {
  const input = useInput({
    error,
    value,
    onSave: onValueChange,
    disabled,
    autoFocus,
    transform,
    allowEmpty: false,
  });

  return (
    <Box direction="column">
      <TextField {...input.attributes} itemRef="" label="Name" placeholder={placeholder} errorMessage={input.errorMessage} />
    </Box>
  );
};

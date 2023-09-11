import { Box, TextField } from '@voiceflow/ui-next';
import React from 'react';

import { useInput } from '@/hooks/input.hook';

import type { ICMSFormName } from './CMSFormName.interface';

export const CMSFormName: React.FC<ICMSFormName> = ({ pb, pt = 20, error, value: valueProp, autoFocus, placeholder, onValueChange }) => {
  const input = useInput({
    error,
    value: valueProp,
    onSave: onValueChange,
    autoFocus,
    allowEmpty: false,
  });

  return (
    <Box direction="column" px={24} pt={pt} pb={pb}>
      <TextField {...input.attributes} label="Name" placeholder={placeholder} errorMessage={input.error} />
    </Box>
  );
};

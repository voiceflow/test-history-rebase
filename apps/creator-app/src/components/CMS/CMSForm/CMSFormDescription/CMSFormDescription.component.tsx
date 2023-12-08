import { Box, InputFormControl, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { useInput } from '@/hooks/input.hook';

import type { ICMSFormDescription } from './CMSFormDescription.interface';

export const CMSFormDescription: React.FC<ICMSFormDescription> = ({ value, error, minRows = 4, maxRows = 17, placeholder, onValueChange }) => {
  const input = useInput({
    error,
    value,
    onSave: onValueChange,
  });

  return (
    <Box direction="column">
      <InputFormControl id={input.id} label="Description" errorMessage={input.errorMessage}>
        <TextArea {...input.attributes} minRows={minRows} maxRows={maxRows} placeholder={placeholder} />
      </InputFormControl>
    </Box>
  );
};

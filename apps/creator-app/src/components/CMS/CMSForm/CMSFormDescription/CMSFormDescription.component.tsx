import { Box, InputFormControl, TextArea } from '@voiceflow/ui-next';
import React, { useId } from 'react';

import { useInput } from '@/hooks/input.hook';

import type { ICMSFormDescription } from './CMSFormDescription.interface';

export const CMSFormDescription: React.FC<ICMSFormDescription> = ({ pb, pt, value: valueProp, placeholder, onValueChange }) => {
  const id = useId();
  const input = useInput({
    value: valueProp,
    onSave: onValueChange,
  });

  return (
    <Box direction="column" px={24} pt={pt} pb={pb}>
      <InputFormControl id={id} label="Description" errorMessage={input.error}>
        <TextArea {...input.attributes} minRows={4} placeholder={placeholder} />
      </InputFormControl>
    </Box>
  );
};

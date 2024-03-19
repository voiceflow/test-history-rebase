import { Box, InputFormControl, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { useInput } from '@/hooks/input.hook';

import type { ICMSFormDescription } from './CMSFormDescription.interface';

export const CMSFormDescription: React.FC<ICMSFormDescription> = ({
  value,
  error,
  testID,
  minRows = 4,
  maxRows = 17,
  disabled,
  placeholder,
  onValueChange,
}) => {
  const input = useInput<string, HTMLTextAreaElement>({
    error,
    value,
    onSave: onValueChange,
    disabled,
  });

  return (
    <Box direction="column">
      <InputFormControl id={input.id} label="Description" errorMessage={input.errorMessage}>
        <TextArea {...input.attributes} testID={testID} minRows={minRows} maxRows={maxRows} disabled={disabled} placeholder={placeholder} />
      </InputFormControl>
    </Box>
  );
};

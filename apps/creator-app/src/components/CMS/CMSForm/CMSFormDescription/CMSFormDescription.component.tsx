import { Box, InputFormControl, TextArea } from '@voiceflow/ui-next';
import React from 'react';

import { useInput } from '@/hooks/input.hook';

import type { ICMSFormDescription } from './CMSFormDescription.interface';

export const CMSFormDescription: React.FC<ICMSFormDescription> = ({
  value,
  error,
  minRows = 4,
  maxRows = 17,
  placeholder,
  onValueChange,
  className,
  testID,
  disabled,
}) => {
  const input = useInput<string, HTMLTextAreaElement>({
    error,
    value,
    onSave: onValueChange,
  });

  return (
    <Box direction="column">
      <InputFormControl id={input.id} label="Description" errorMessage={input.errorMessage}>
        <TextArea
          {...input.attributes}
          placeholder={placeholder}
          className={className}
          disabled={disabled}
          minRows={minRows}
          maxRows={maxRows}
          testID={testID}
        />
      </InputFormControl>
    </Box>
  );
};

import { Box, TextField } from '@voiceflow/ui-next';
import React from 'react';

import { useInput } from '@/hooks/input.hook';
import { transformCMSResourceName } from '@/utils/cms.util';

import type { ICMSFormName } from './CMSFormName.interface';

export const CMSFormName: React.FC<ICMSFormName> = ({
  error,
  value,
  disabled,
  transform = transformCMSResourceName,
  autoFocus,
  rightLabel,
  placeholder,
  containerRef,
  onValueChange,
  onPointerEnter,
  onPointerLeave,
  testID,
}) => {
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
    <Box direction="column" onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave}>
      <TextField
        {...input.attributes}
        label="Name"
        rightLabel={rightLabel}
        placeholder={placeholder}
        containerRef={containerRef}
        errorMessage={input.errorMessage}
        testID={testID}
      />
    </Box>
  );
};

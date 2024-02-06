import { Box, TextField } from '@voiceflow/ui-next';
import React from 'react';

import { useInput } from '@/hooks/input.hook';

import type { IComponentDescriptionInput } from './ComponentDescriptionInput.interface';

export const ComponentDescriptionInput: React.FC<IComponentDescriptionInput> = ({ value, disabled, onValueChange }) => {
  const input = useInput({
    value: value ?? '',
    onSave: (value) => onValueChange(value.trim() || null),
    disabled,
  });

  return (
    <Box direction="column">
      <TextField {...input.attributes} label="Description" placeholder="Enter description (optional)" />
    </Box>
  );
};

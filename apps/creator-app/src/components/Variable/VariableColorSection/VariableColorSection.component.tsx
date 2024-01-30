import { Box, InputFormControl, Variable } from '@voiceflow/ui-next';
import React from 'react';

import { VariableColorPicker } from '../VariableColorPicker/VariableColorPicker.component';
import type { IVariableColorSection } from './VariableColorSection.interface';

export const VariableColorSection: React.FC<IVariableColorSection> = ({ name, color, disabled, onColorChange }) => (
  <Box direction="column">
    <InputFormControl label="Color" rightLabel={name && <Variable label={name} color={color} />}>
      <VariableColorPicker value={color} disabled={disabled} onValueChange={onColorChange} />
    </InputFormControl>
  </Box>
);

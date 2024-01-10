import { Box, TextField, Variable } from '@voiceflow/ui-next';
import React from 'react';

import type { IInputVariableEditor } from './InputVariableEditor.interface';

export const InputVariableEditor: React.FC<IInputVariableEditor> = ({ variable, loading, setValue, value, autoFocus }) => (
  <Box key={variable.id} direction="column" gap={6}>
    <Variable size="large" label={variable.name} />

    <Box direction="column">
      <TextField autoFocus={autoFocus} value={value} disabled={loading} onValueChange={setValue} placeholder="Enter input variable value" />
    </Box>
  </Box>
);

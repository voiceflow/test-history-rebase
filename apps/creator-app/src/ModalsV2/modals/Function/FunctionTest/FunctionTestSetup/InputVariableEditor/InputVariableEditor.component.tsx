import { useSessionStorageState } from '@voiceflow/ui';
import { Box, Input, Variable } from '@voiceflow/ui-next';
import React from 'react';

import { useInput } from '@/hooks/input.hook';

import type { IInputVariableEditor } from './InputVariableEditor.interface';

export const InputVariableEditor: React.FC<IInputVariableEditor> = ({ variable }) => {
  const [value, setValue] = useSessionStorageState(variable.id, '');
  const input = useInput({
    value,
    onSave: setValue,
    allowEmpty: false,
  });

  return (
    <Box key={variable.id} direction="column" px={24} pb={15}>
      <Box width="100%" mb={7}>
        <Variable size="large" label={variable.name} />
      </Box>
      <Input {...input.attributes} placeholder="Enter variable value" />
    </Box>
  );
};

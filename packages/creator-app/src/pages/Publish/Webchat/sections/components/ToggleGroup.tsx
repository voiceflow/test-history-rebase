import { Box, Toggle } from '@voiceflow/ui';
import React from 'react';

import { ToggleGroupContainer } from './styled';

interface ToggleGroupProps {
  value: boolean;
  disabled: boolean;
  onToggle: VoidFunction;
}

const ToggleGroup: React.FC<ToggleGroupProps> = ({ value, onToggle, disabled }) => {
  return (
    <ToggleGroupContainer onClick={disabled ? undefined : onToggle}>
      <Box mr={12}>{value ? 'On' : 'Off'}</Box>
      <Toggle size={Toggle.Size.EXTRA_SMALL} checked={value} disabled={disabled} />
    </ToggleGroupContainer>
  );
};

export default ToggleGroup;

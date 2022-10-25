import { Box, Toggle } from '@voiceflow/ui';
import React from 'react';

import { ToggleGroupContainer } from './styled';

interface ToggleGroupProps {
  value: boolean;
  onToggle: VoidFunction;
}

const ToggleGroup: React.FC<ToggleGroupProps> = ({ value, onToggle }) => {
  return (
    <ToggleGroupContainer onClick={onToggle}>
      <Box mr={12}>{value ? 'On' : 'Off'}</Box>
      <Toggle size={Toggle.Size.EXTRA_SMALL} checked={value} />
    </ToggleGroupContainer>
  );
};

export default ToggleGroup;

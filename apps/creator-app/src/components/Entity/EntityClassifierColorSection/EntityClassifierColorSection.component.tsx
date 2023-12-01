import { Box } from '@voiceflow/ui-next';
import React from 'react';

import { EntityClassifierDropdown } from '../EntityClassifierDropdown/EntityClassifierDropdown.component';
import { EntityColorPicker } from '../EntityColorPicker/EntityColorPicker.component';
import type { IEntityClassifierColorSection } from './EntityClassifierColorSection.interface';

export const EntityClassifierColorSection: React.FC<IEntityClassifierColorSection> = ({
  name,
  color,
  disabled,
  typeError,
  classifier,
  typeMinWidth,
  onColorChange,
  onClassifierClick,
  onClassifierChange,
}) => (
  <Box align="end" gap={20}>
    <EntityClassifierDropdown
      value={classifier}
      error={typeError}
      onClick={onClassifierClick}
      minWidth={typeMinWidth}
      disabled={disabled}
      onValueChange={onClassifierChange}
    />

    <EntityColorPicker name={name} value={color} disabled={disabled} onValueChange={onColorChange} />
  </Box>
);

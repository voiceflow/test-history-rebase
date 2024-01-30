import { Box } from '@voiceflow/ui-next';
import React from 'react';

import { EntityClassifierDropdown } from '../EntityClassifierDropdown/EntityClassifierDropdown.component';
import { EntityColorPicker } from '../EntityColorPicker/EntityColorPicker.component';
import type { IEntityClassifierColorSection } from './EntityClassifierColorSection.interface';

export const EntityClassifierColorSection: React.FC<IEntityClassifierColorSection> = ({
  name,
  color,
  disabled,
  classifier,
  onColorChange,
  classifierError,
  onClassifierClick,
  onClassifierChange,
  classifierMinWidth,
}) => (
  <Box gap={20}>
    <EntityClassifierDropdown
      value={classifier}
      error={classifierError}
      onClick={onClassifierClick}
      minWidth={classifierMinWidth}
      disabled={disabled}
      onValueChange={onClassifierChange}
    />

    <EntityColorPicker name={name} value={color} disabled={disabled} onValueChange={onColorChange} />
  </Box>
);

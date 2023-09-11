import { Box } from '@voiceflow/ui-next';
import React from 'react';

import { EntityColorPicker } from '../EntityColorPicker/EntityColorPicker.component';
import { EntityTypeDropdown } from '../EntityTypeDropdown/EntityTypeDropdown.component';
import type { IEntityTypeColorSection } from './EntityTypeColorSection.interface';

export const EntityTypeColorSection: React.FC<IEntityTypeColorSection> = ({ pb, pt, type, name, color, typeError, onTypeChange, onColorChange }) => (
  <Box px={24} pt={pt} pb={pb} gap={20}>
    <Box width="100%" direction="column">
      <EntityTypeDropdown value={type} error={typeError} onValueChange={onTypeChange} />
    </Box>

    <Box direction="column" width="112px">
      <EntityColorPicker name={name} value={color} onValueChange={onColorChange} />
    </Box>
  </Box>
);

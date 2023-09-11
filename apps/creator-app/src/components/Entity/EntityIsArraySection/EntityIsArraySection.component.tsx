import { Box, RadioGroup } from '@voiceflow/ui-next';
import React from 'react';

import type { IEntityIsArraySection } from './EntityIsArraySection.interface';

export const EntityIsArraySection: React.FC<IEntityIsArraySection> = ({ pb, value, onValueChange }) => (
  <Box pt={16} pb={pb} px={24}>
    <RadioGroup
      value={value}
      label="Is Array"
      layout="horizontal"
      options={[
        { id: 'no', value: false, label: 'No' },
        { id: 'yes', value: true, label: 'Yes' },
      ]}
      onValueChange={onValueChange}
    />
  </Box>
);

import { Box, Entity, Text } from '@voiceflow/ui-next';
import React from 'react';

import type { IEntityColorPicker } from './EntityColorPicker.interface';

export const EntityColorPicker: React.FC<IEntityColorPicker> = ({ name, value }) => (
  <Box direction="column" width="112px" pl={8} pb={8} minHeight="60px" gap={15}>
    {/* TODO: fix color value */}
    <Box height="17px" justify="end">
      {name && <Entity label={name} color={value as any} />}
    </Box>

    <Text>TODO: colors</Text>
  </Box>
);

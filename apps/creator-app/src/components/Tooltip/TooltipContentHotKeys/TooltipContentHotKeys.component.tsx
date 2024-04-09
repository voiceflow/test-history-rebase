import { Box, HotKeys, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

import type { ITooltipContentHotKeys } from './TooltipContentHotKeys.interface';

export const TooltipContentHotKeys: React.FC<ITooltipContentHotKeys> = ({ label, hotkeys }) => (
  <Box>
    <Tooltip.Caption mb={0}>{label}</Tooltip.Caption>
    <HotKeys hotKeys={hotkeys} />
  </Box>
);

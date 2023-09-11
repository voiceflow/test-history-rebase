import { Box } from '@voiceflow/ui-next';
import React from 'react';

import type { ICMSResourceActions } from './CMSResourceActions.interface';

export const CMSResourceActions: React.FC<ICMSResourceActions> = ({ actions, className }) => (
  <Box className={className} height="56px" px={24} align="center" gap={12}>
    {actions}
  </Box>
);

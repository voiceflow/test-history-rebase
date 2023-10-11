import { Box, Icon, Tokens } from '@voiceflow/ui-next';
import React from 'react';

export const DocumentStatusSuccess: React.FC = () => (
  <Box gap={12}>
    <Icon name="Checkmark" color={Tokens.colors.success.success600} height={26} width={24} />
  </Box>
);

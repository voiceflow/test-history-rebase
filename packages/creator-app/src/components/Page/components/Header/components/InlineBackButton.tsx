import { Box } from '@voiceflow/ui';
import React from 'react';

import IconButton from './IconButton';

interface InlineBackButtonProps {
  onClick: VoidFunction;
}

const InlineBackButton: React.FC<InlineBackButtonProps> = ({ onClick }) => (
  <Box ml={18} mr={8}>
    <IconButton icon="largeArrowLeft" onClick={onClick} />
  </Box>
);

export default InlineBackButton;

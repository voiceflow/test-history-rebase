import { Box, SvgIcon } from '@voiceflow/ui';
import React from 'react';

interface BackButtonProps {
  onClick: VoidFunction;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => (
  <Box.FlexCenter ml={18} mr={4} width={42} height={42} cursor="pointer" color="rgba(110, 132, 154, 0.85)">
    <SvgIcon icon="largeArrowLeft" size={16} onClick={onClick} />
  </Box.FlexCenter>
);

export default BackButton;

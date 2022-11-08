import { Box, Button } from '@voiceflow/ui';
import React from 'react';

import { StyledTabButton } from '../styles';

interface TabButtonProps {
  title: string;
  onClick: VoidFunction;
  active: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({ title, onClick, active }) => {
  return (
    <Box onClick={onClick}>
      {active ? (
        <Button variant={Button.Variant.QUATERNARY} squareRadius>
          {title}
        </Button>
      ) : (
        <StyledTabButton>{title}</StyledTabButton>
      )}
    </Box>
  );
};

export default TabButton;

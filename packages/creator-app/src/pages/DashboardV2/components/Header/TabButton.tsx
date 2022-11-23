import { Box, Button } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

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
        <S.StyledTabButton>{title}</S.StyledTabButton>
      )}
    </Box>
  );
};

export default TabButton;

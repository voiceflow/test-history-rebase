import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs/styled';

interface TabButtonProps {
  onClick?: VoidFunction;
  active?: boolean;
  children?: React.ReactNode;
}

const TabButtonContainer = styled(Button)`
  color: #949db0;
  background: none;
  padding: 8px 16px;
  font-size: 15px;
  border: none;
  box-shadow: none;
  span {
    padding: 0;
  }
  &:hover {
    color: #6e849a;
    background: none;
  }
`;

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => {
  if (!active) {
    return (
      <Button variant={ButtonVariant.QUATERNARY} squareRadius style={{ padding: '8px 16px' }}>
        {children}
      </Button>
    );
  }

  return (
    <TabButtonContainer squareRadius onClick={onClick}>
      {children}
    </TabButtonContainer>
  );
};

export default TabButton;

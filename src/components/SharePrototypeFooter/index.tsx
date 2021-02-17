import React from 'react';

import { Flex } from '@/components/Box';

import { Container, LeftEdge, OutterContainer, RightEdge } from './components';
import ActionButtons from './components/ActionButtons';

type SharePrototypeFooterProps = {
  isMuted: boolean;
  canRestart: boolean;
  resetTest: () => void;
  goFullscreen: () => void;
};
const SharePrototypeFooter: React.FC<SharePrototypeFooterProps> = ({ children, ...props }) => {
  return (
    <OutterContainer>
      <LeftEdge />
      <Container>
        <Flex flex={2}>{children}</Flex>
        <Flex flex={1} justifyContent="end" flexDirection="row">
          <ActionButtons {...props} />
        </Flex>
      </Container>
      <RightEdge />
    </OutterContainer>
  );
};

export default SharePrototypeFooter;

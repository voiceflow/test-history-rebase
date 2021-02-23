import React from 'react';

import { Flex } from '@/components/Box';

import { ActionButtons, Container, LeftEdge, OuterContainer, RightEdge } from './components';

type FooterProps = {
  onMute: () => void;
  isMuted: boolean;
  onReset: () => void;
  onFullScreen: () => void;
};

const Footer: React.FC<FooterProps> = ({ children, ...props }) => (
  <OuterContainer>
    <LeftEdge />

    <Container>
      <Flex flex={2}>{children}</Flex>
      <Flex flex={1} justifyContent="end" flexDirection="row">
        <ActionButtons {...props} />
      </Flex>
    </Container>

    <RightEdge />
  </OuterContainer>
);

export default Footer;

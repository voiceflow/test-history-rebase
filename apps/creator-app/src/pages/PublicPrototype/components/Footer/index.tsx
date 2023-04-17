import { BoxFlex } from '@voiceflow/ui';
import React from 'react';

import { ActionButtons, Container, LeftEdge, OuterContainer, RightEdge } from './components';

interface FooterProps extends React.PropsWithChildren {
  onMute: () => void;
  isMuted: boolean;
  onReset: () => void;
  onFullScreen: () => void;
}

const Footer: React.FC<FooterProps> = ({ children, ...props }) => (
  <OuterContainer>
    <LeftEdge />

    <Container>
      <BoxFlex flex={2}>{children}</BoxFlex>
      <BoxFlex flex={1} justifyContent="end" flexDirection="row">
        <ActionButtons {...props} />
      </BoxFlex>
    </Container>

    <RightEdge />
  </OuterContainer>
);

export default Footer;

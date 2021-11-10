import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs';
import { useOpenIntercom } from '@/vendors/intercom';

const Container = styled.a`
  text-decoration: none !important;
`;

const StartAChatButton: React.FC = () => {
  const openIntercom = useOpenIntercom();

  return (
    <Container href="/" onClick={openIntercom}>
      <Button variant={ButtonVariant.PRIMARY}>Start a Chat</Button>
    </Container>
  );
};

export default StartAChatButton;

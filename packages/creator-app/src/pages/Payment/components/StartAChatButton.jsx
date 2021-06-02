import React from 'react';

import Button from '@/components/Button';
import { styled } from '@/hocs';
import { useOpenIntercom } from '@/vendors/intercom';

const Container = styled.a`
  text-decoration: none !important;
`;

function StartAChatButton() {
  const openIntercom = useOpenIntercom();

  return (
    <Container href="/" onClick={openIntercom}>
      <Button variant="primary">Start a Chat</Button>
    </Container>
  );
}

export default StartAChatButton;

import React from 'react';

import Button from '@/componentsV2/Button';
import { styled } from '@/hocs';

const Container = styled.a`
  text-decoration: none !important;
`;

function StartAChatButton() {
  return (
    <Container href="/" className="custom_intercom_launcher">
      <Button variant="primary">Start a Chat</Button>
    </Container>
  );
}

export default StartAChatButton;

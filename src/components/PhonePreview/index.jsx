import React from 'react';

import { Container, Content, Image } from './components';

function PhonePreview({ image }) {
  return (
    <Container>
      <Content>
        <Image src={image} alt="smartphone preview" />
      </Content>
    </Container>
  );
}

export default PhonePreview;

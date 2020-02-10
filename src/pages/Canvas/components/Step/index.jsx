import React from 'react';

import { Container, Image, ImageContainer } from './components';

export * from './components';

const Step = ({ isActive, image, children }) => {
  return (
    <Container isActive={isActive}>
      {children}
      {image && (
        <ImageContainer>
          <Image image={image} />
        </ImageContainer>
      )}
    </Container>
  );
};

export default Step;

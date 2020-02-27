import React from 'react';

import { Container, Image, ImageContainer } from './components';

export * from './components';

export type BaseStepProps = { image?: string; isActive?: boolean };

export type StepProps = BaseStepProps & { children: React.ReactNode | React.ReactNode[] };

const Step: React.FC<StepProps> = ({ isActive, image, children }) => {
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

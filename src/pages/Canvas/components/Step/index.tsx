import React from 'react';

import { stopPropagation } from '@/utils/dom';

import { Container, Image, ImageContainer } from './components';

export * from './components';
export * from './types';

export type BaseStepProps = {
  image?: string;
  isActive?: boolean;
  onClick?: () => void;
};

export type StepProps = BaseStepProps & { children: React.ReactNode | React.ReactNode[] };

const Step: React.FC<StepProps> = ({ isActive, onClick, image, children }) => {
  return (
    <Container isActive={isActive} onMouseDown={stopPropagation(null, true)} onMouseUp={stopPropagation(null, true)} onClick={onClick}>
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

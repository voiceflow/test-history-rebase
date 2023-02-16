import React from 'react';

import { css, styled } from '@/hocs/styled';

export interface StepImageProps {
  noContainer?: boolean;
  borderRadius?: number;
  image: string;
  position?: string;
  aspectRatio?: number | null;
}

interface ContainerProps {
  aspectRatio?: number | null;
}

const Image = styled.div<StepImageProps>`
  width: 100%;

  border-radius: ${({ borderRadius }) => `${borderRadius ?? 5}px`};
  background: ${({ image, position = 'center center' }) => `url(${image}) no-repeat ${position}`};
  background-size: cover;

  ${({ aspectRatio }) =>
    aspectRatio
      ? css`
          height: auto;
          padding-bottom: ${100 / aspectRatio}%;
        `
      : css`
          height: 100%;
        `}
`;

const ImageContainer = styled.div<ContainerProps>`
  ${({ aspectRatio }) =>
    aspectRatio
      ? css`
          width: calc(100% - 4px);
          margin: 2px;
        `
      : css`
          width: 100%;
          height: 180px;
          padding: 2px;
        `}
`;

const StepImage: React.FC<StepImageProps> = ({ noContainer, image, position, aspectRatio, borderRadius }) => {
  const Container = noContainer ? React.Fragment : ImageContainer;

  return (
    <Container aspectRatio={aspectRatio}>
      <Image image={image} position={position} aspectRatio={aspectRatio} borderRadius={borderRadius} />
    </Container>
  );
};

export default StepImage;

import React from 'react';

import { css, styled, units } from '@/hocs';

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
  box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.08), 0 0 1px 1px rgba(17, 49, 96, 0.08);

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
          width: calc(100% - ${units(3)}px);
          margin: 0 ${units(1.5)}px ${units(1.5)}px ${units(1.5)}px;
        `
      : css`
          width: 100%;
          height: 180px;
          padding: 0 ${units(1.5)}px ${units(1.5)}px ${units(1.5)}px;
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

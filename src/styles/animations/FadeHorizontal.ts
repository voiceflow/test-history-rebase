import { SpaceProps, space } from 'styled-system';

import { css, keyframes, styled } from '@/hocs';

const FadeHorizontalKeyframes = (distance = 40) => keyframes`
  from {
    transform: translate3d(${distance}px, 0, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`;

export type FadeProps = {
  distance?: number;
};

export const FadeLeft = css<FadeProps>`
  animation-fill-mode: both;
  animation: ${({ distance }) => FadeHorizontalKeyframes(distance)} 180ms ease-in-out;
`;

export const FadeRight = css<FadeProps>`
  animation-fill-mode: both;
  animation: ${({ distance = -40 }) => FadeHorizontalKeyframes(distance)} 180ms ease-in-out;
`;

export const FadeLeftContainer = styled.div<FadeProps & SpaceProps>`
  ${space}
  ${FadeLeft}
`;

export const FadeRightContainer = styled.div<FadeProps & SpaceProps>`
  ${space}
  ${FadeRight}
`;

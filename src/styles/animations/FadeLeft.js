import { css, keyframes, styled } from '@/hocs';

const FadeLeftKeyframes = (distance = 40) => keyframes`
  from {
    transform: translate3d(${distance}px, 0, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`;

// eslint-disable-next-line import/prefer-default-export
export const FadeLeft = css`
  animation: ${({ distance }) => FadeLeftKeyframes(distance)} 180ms ease-in-out;
  animation-fill-mode: both;
`;

export const FadeLeftContainer = styled.div`
  ${FadeLeft}
`;

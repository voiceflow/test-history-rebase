import { css, keyframes } from '@/hocs';

const FadeLeftKeyframes = keyframes`
  from {
    transform: translate3d(40px, 0, 0);
    opacity: 0;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
`;

// eslint-disable-next-line import/prefer-default-export
export const FadeLeft = css`
  animation: ${FadeLeftKeyframes} 180ms ease-in-out;
  animation-fill-mode: both;
`;

import { css, keyframes } from '@/hocs';

const SpinKeyframes = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

// eslint-disable-next-line import/prefer-default-export
export const Spin = css`
  animation: ${SpinKeyframes} ${({ speed = 1000 }) => speed}ms linear infinite;
`;

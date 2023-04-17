import { css, keyframes } from '@ui/styles';

const SpinKeyframes = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const SpinReverseKeyframes = keyframes`
  to {
    transform: rotate(-360deg);
  }
`;

export interface SpinProps {
  speed?: number;
}

export const Spin = css<SpinProps>`
  animation: ${SpinKeyframes} ${({ speed = 1000 }) => speed}ms linear infinite;
`;

export const SpinReverse = css<SpinProps>`
  animation: ${SpinReverseKeyframes} ${({ speed = 1000 }) => speed}ms linear infinite;
`;

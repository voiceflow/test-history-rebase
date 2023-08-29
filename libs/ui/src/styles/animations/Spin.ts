import { css, keyframes } from '@ui/styles';

export const spinKeyframes = keyframes`
  to {
    rotate: 360deg;
  }
`;

export const spinReverseKeyframes = keyframes`
  to {
    rotate: -360deg;
  }
`;

export interface SpinProps {
  speed?: number;
}

export const spinStyle = css<SpinProps>`
  animation: ${spinKeyframes} ${({ speed = 1000 }) => speed}ms linear infinite;
`;

export const spinReverseStyle = css<SpinProps>`
  animation: ${spinReverseKeyframes} ${({ speed = 1000 }) => speed}ms linear infinite;
`;

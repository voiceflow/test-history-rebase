import { css, keyframes } from '@/hocs/styled';

const SpinKeyframes = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export interface SpinProps {
  speed?: number;
}

export const Spin = css<SpinProps>`
  animation: ${SpinKeyframes} ${({ speed = 1000 }) => speed}ms linear infinite;
`;

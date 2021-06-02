import { css, keyframes } from '@/hocs';

const SpinKeyframes = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export type SpinProps = {
  speed?: number;
};

export const Spin = css<SpinProps>`
  animation: ${SpinKeyframes} ${({ speed = 1000 }) => speed}ms linear infinite;
`;

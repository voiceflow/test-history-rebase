import { css, keyframes } from '@/hocs';

const SpinKeyframes = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export type SpinProps = {
  speed?: number;
};

// eslint-disable-next-line import/prefer-default-export
export const Spin = css<SpinProps>`
  animation: ${SpinKeyframes} ${({ speed = 1000 }) => speed}ms linear infinite;
`;

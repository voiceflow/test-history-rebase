import { css, keyframes } from '@ui/styles';

const ScaleInKeyframes = keyframes`
  from {
    transform: scale(0)
  }

  to {
    transform: scale(1);
  }
`;

export interface ScaleInProps {
  speed?: number;
}

export const ScaleIn = css<ScaleInProps>`
  animation: ${ScaleInKeyframes} ${({ speed = 100 }) => speed}ms linear;
`;

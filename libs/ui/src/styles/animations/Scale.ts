import { css, keyframes } from '@ui/styles';

export const scaleInKeyframes = keyframes`
  from {
    scale: 0;
  }

  to {
    scale: 1;
  }
`;

export const scaleInXKeyframes = keyframes`
  from {
    scale: 0 1;
  }

  to {
    scale: 1 1;
  }
`;

export const scaleInYKeyframes = keyframes`
  from {
    scale: 1 0;
  }

  to {
    scale: 1 1;
  }
`;

export interface ScaleInProps {
  speed?: number;
}

export const scaleInStyle = css<ScaleInProps>`
  animation: ${scaleInKeyframes} ${({ speed = 100 }) => speed}ms linear;
`;

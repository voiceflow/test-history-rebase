import { css, keyframes, styled, transition } from '@ui/styles';

export interface ContainerProps {
  width?: number | string;
  height: number;
  loading?: boolean;
  background?: string;
}

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
`;

export const Container = styled.div<ContainerProps>`
  position: relative;
  overflow: hidden;
  border-radius: 5px;

  ${({ width = '100%', height, background = '#dfe3ed' }) => css`
    width: ${typeof width === 'number' ? `${width}px` : width};
    height: ${height}px;
    background-color: ${background};
  `}

  ${({ loading }) =>
    loading &&
    css`
      &:before {
        position: absolute;
        inset: 0;
        content: '';
        animation: ${slideIn} 1.5s cubic-bezier(0.4, 0, 1, 1) infinite;
        background-image: linear-gradient(
          to right,
          rgba(238, 238, 238, 0) 0%,
          rgba(255, 255, 255, 0.4) 50%,
          rgba(238, 238, 238, 0) 100%
        );
      }
    `}
`;

export interface ProgressProps {
  color: string;
  height: number;
  loading?: boolean;
  progress: number;
}

export const Progress = styled.div<ProgressProps>`
  ${transition('width')}
  position: absolute;
  width: 0;
  left: 0;

  ${({ color, height, progress }) => css`
    width: ${progress * 100}%;
    height: ${height}px;
    background: ${color};
  `}
`;

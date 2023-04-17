import { css, styled } from '@/hocs/styled';

export const Container = styled.div<{ top?: number; width?: number }>`
  position: fixed;
  ${({ top }) =>
    top &&
    css`
      top: ${top}px;
    `}

  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}
`;

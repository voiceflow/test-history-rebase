import { css, styled } from '@ui/styles';

export interface ColumnProps {
  flex: number;
  width?: number;
}

const Column = styled.div<ColumnProps>`
  display: flex;
  align-items: center;
  height: 100%;
  flex: ${({ flex }) => flex};

  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
      min-width: ${width}px;
      max-width: ${width}px;
    `}
`;

export default Column;

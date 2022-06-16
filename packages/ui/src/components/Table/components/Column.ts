import { styled } from '@ui/styles';

export interface ColumnProps {
  flex: number;
}

const Column = styled.div<ColumnProps>`
  display: flex;
  align-items: center;
  height: 100%;
  min-width: 28px;
  flex: ${({ flex }) => flex};
`;

export default Column;

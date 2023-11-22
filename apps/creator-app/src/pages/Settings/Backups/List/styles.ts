import { Box } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

import { RowItem } from './Item/styles';

export const TableHeader = styled(Box.FlexCenter)`
  display: flex;
  color: #62778c;
  font-size: 13px;
  padding: 18px 32px;
  gap: 32px;
`;

const getColumnStyles = (columns: number[]) =>
  columns.map(
    (column, index) => css`
      & > :nth-child(${index + 1}) {
        flex: ${column};
      }
    `
  );

export const TableContainer = styled(Box)<{ columns: number[] }>`
  ${({ columns }) => getColumnStyles(columns)}
  border-top: solid 1px #eaeff4;
  padding-bottom: 2px;

  ${TableHeader}, ${RowItem} {
    display: flex;
    justify-content: center;
    border-bottom: solid 1px #eaeff4;

    ${({ columns }) => columns && getColumnStyles(columns)}
  }

  ${RowItem}:last-child {
    border-bottom: none;
  }
`;

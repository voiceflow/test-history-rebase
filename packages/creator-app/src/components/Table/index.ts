import { Box, BoxFlexCenter } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const Descriptor = styled.div`
  font-size: 13px;
  color: #62778c;
  padding: 0 32px;
  margin: 17px 0;
`;

export const TableHeader = styled(BoxFlexCenter)`
  font-size: 13px;
  color: #62778c;
  border-bottom: solid 1px #eaeff4;
`;

export const TableRow = styled(BoxFlexCenter)<{ hasBorder?: boolean }>`
  font-size: 15px;

  ${({ hasBorder }) =>
    hasBorder &&
    css`
      border-bottom: solid 1px #eaeff4;
    `}
`;

export const getColumnStyles = (columns: number[]) => {
  return columns.map(
    (column, index) => css`
      & > :nth-child(${index + 1}) {
        flex: ${column};
      }
    `
  );
};

export const TableContainer = styled(Box)<{ columns?: number[]; topBorder?: boolean; allBorders?: boolean }>`
  padding-bottom: 10px;

  ${({ topBorder }) =>
    topBorder &&
    css`
      border-top: solid 1px #eaeff4;
    `}

  ${({ allBorders }) =>
    allBorders &&
    css`
      border-left: solid 1px #eaeff4;
      border-right: solid 1px #eaeff4;
      border-bottom: solid 1px #eaeff4;
      border-radius: 8px;
      padding-bottom: 0;
    `}

  ${TableHeader}, ${TableRow} {
    display: flex;
    justify-content: center;
    padding-left: 32px;
    padding-right: 32px;
    min-height: 60px;

    ${({ columns }) => columns && getColumnStyles(columns)}
  }
`;

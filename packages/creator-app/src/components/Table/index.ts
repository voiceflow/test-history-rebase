import { Box, BoxFlexCenter } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

export const Descriptor = styled.div`
  font-size: 13px;
  color: #62778c;
  padding: 0 32px;
  margin: 17px 0;
`;

export const TableHeader = styled(BoxFlexCenter)`
  font-size: 13px;
  color: #62778c;
`;

export const TableRow = styled(BoxFlexCenter)`
  font-size: 15px;
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

export const TableContainer = styled(Box)<{ columns?: number[]; topBorder?: boolean }>`
  padding-bottom: 10px;

  ${({ topBorder }) =>
    topBorder &&
    css`
      border-top: solid 1px #eaeff4;
    `}

  ${TableHeader}, ${TableRow} {
    display: flex;
    justify-content: center;
    padding-left: 32px;
    padding-right: 32px;
    min-height: 60px;
    border-bottom: solid 1px #eaeff4;

    ${({ columns }) => columns && getColumnStyles(columns)}
  }
`;

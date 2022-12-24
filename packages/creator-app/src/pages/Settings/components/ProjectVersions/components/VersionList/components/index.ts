import { Box, BoxFlexCenter } from '@voiceflow/ui';

import { getColumnStyles } from '@/components/Table';
import { styled } from '@/hocs/styled';

import { RowItem } from './VersionItem/components';

export const TableHeader = styled(BoxFlexCenter)`
  display: flex;
  color: #62778c;
  font-size: 13px;
  padding: 18px 32px;
  gap: 32px;
`;

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

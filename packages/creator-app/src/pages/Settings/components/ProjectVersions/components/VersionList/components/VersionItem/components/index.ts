import { TableRow } from '@/components/Table';
import { styled } from '@/hocs';

export const RowItem = styled(TableRow)`
  display: flex;
  margin-left: 32px;
  min-height: unset;
  padding: 15px 32px 15px 0;
`;

export const ColumnItemContainer = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
  gap: 16px;
`;

export const ActionsItemContainer = styled.span`
  display: flex;
  flex-direction: row-reverse;
`;

import { TableRow } from '@/components/Table';
import { styled } from '@/hocs';

export const RowItem = styled(TableRow)`
  display: flex;
  margin-left: 32px;
  min-height: unset;
  padding: 16px 32px 15px 0;
  gap: 16px;
`;

export const ColumnItemContainer = styled.span`
  ::first-letter {
    text-transform: capitalize;
  }

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
`;

export const ActionsItemContainer = styled.span`
  display: flex;
  flex-direction: row-reverse;
`;

import { Table } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Dot = styled.div`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #62778c;
  margin-left: 8px;
  margin-right: 8px;
`;

export const RowButtons = styled.div`
  display: flex;
  align-items: center;
  visibility: hidden;
`;

export const UnclassifiedTableRow = styled(Table.Row)`
  height: 88px;
  display: flex;
  justify-content: space-between;

  &:hover {
    ${RowButtons} {
      visibility: visible;
    }
  }
`;

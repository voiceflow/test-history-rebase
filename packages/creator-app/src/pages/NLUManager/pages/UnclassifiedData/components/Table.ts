import { Table } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const RowButtons = styled.div`
  display: flex;
  align-items: center;
  visibility: hidden;
`;

export const Row = styled(Table.Row)`
  padding: 20px 32px;
  display: flex;
  justify-content: space-between;

  &:hover {
    ${RowButtons} {
      visibility: visible;
    }
  }
`;

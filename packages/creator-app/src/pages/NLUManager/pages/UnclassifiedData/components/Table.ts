import { Table } from '@voiceflow/ui';

import { styled } from '@/hocs';

export const RowButtons = styled.div`
  display: flex;
  align-items: center;
  visibility: hidden;
`;

export const Row = styled(Table.Row)`
  height: 88px;
  display: flex;
  justify-content: space-between;

  &:hover {
    ${RowButtons} {
      visibility: visible;
    }
  }
`;

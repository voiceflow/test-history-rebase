import { Table } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const RowButtons = styled.div<{ hovered?: boolean }>`
  display: flex;
  align-items: center;
  visibility: ${({ hovered }) => (hovered ? 'visible' : 'hidden')};
`;

export const Row = styled(Table.Row)`
  padding: 20px 27px;
  display: flex;
  justify-content: space-between;

  &:hover {
    ${RowButtons} {
      visibility: visible;
    }
  }
`;

import { Table } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const RowButtons = styled.div<{ hovered?: boolean }>`
  align-items: center;
  display: ${({ hovered }) => (hovered ? 'flex' : 'none')};
`;

export const Row = styled(Table.Row)`
  padding: 20px 27px;
  display: flex;
  justify-content: space-between;

  ${({ hoverDisabled = false }) =>
    !hoverDisabled &&
    css`
    &:hover {
      ${RowButtons} {
        display: flex;
      }
    `};
`;

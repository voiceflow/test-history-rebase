import { Box } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

export const Badge = styled(Box.Flex)<{ isActive?: boolean }>`
  ${transition('color', 'background')}
  color: #62778c;
  font-size: 13px;
  border: solid 1px #dfe3ed;
  padding: 2px 8px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: rgba(238, 244, 246, 0.6);
  }

  ${({ isActive }) =>
    isActive &&
    css`
      color: #132144;
      background: #eef4f6;
    `}
`;

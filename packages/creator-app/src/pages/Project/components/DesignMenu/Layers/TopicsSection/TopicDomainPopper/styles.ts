import { Box, SvgIcon } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const ContextMenuOption = styled(Box.Flex)<{ isActive?: boolean }>`
  gap: 21px;
  position: relative;

  ${({ isActive }) =>
    isActive &&
    css`
      ${SvgIcon.Container} {
        transform: translateX(8px);
        opacity: 1;
      }
    `}
`;

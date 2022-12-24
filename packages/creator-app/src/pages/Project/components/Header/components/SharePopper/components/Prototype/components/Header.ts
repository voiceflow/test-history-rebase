import { Box } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const MenuContentHeader = styled(Box)<{ isScrolling?: boolean }>`
  position: relative;
  z-index: 2;
  padding: 24px 32px 16px;

  ${({ isScrolling }) =>
    isScrolling &&
    css`
      box-shadow: 0 0 1px 1px rgba(17, 49, 96, 0.08), 0 1px 3px 0 rgba(17, 49, 96, 0.08);
    `}
`;

export default MenuContentHeader;

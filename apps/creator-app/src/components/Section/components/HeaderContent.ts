import { Flex } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const HeaderContent = styled(Flex)<{ truncated?: boolean; overflowHidden?: boolean }>`
  ${({ truncated }) =>
    truncated &&
    css`
      /* truncated text hack https://css-tricks.com/flexbox-truncated-text/ */
      min-width: 0;
    `}

  ${({ overflowHidden }) =>
    overflowHidden &&
    css`
      overflow-x: hidden;
    `}
`;

export default HeaderContent;

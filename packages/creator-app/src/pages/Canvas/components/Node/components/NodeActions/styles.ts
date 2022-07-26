import { FlexCenter } from '@voiceflow/ui';

import { css, styled } from '@/hocs';
import { NODE_LINK_WIDTH } from '@/pages/Canvas/components/Port/constants';

export const Container = styled(FlexCenter)<{ reversed?: boolean }>`
  position: absolute;
  ${({ theme, reversed }) =>
    reversed
      ? css`
          right: ${theme.components.block.width - NODE_LINK_WIDTH + 2}px;
          flex-direction: row-reverse;
        `
      : css`
          left: ${theme.components.block.width - NODE_LINK_WIDTH + 2}px;
        `};
`;

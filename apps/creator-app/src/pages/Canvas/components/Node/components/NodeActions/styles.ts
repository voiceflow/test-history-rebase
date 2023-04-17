import { FlexCenter } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';
import { NODE_LINK_WIDTH } from '@/pages/Canvas/components/Port/constants';

interface ContainerProps {
  isChip?: boolean;
  reversed?: boolean;
}

export const Container = styled(FlexCenter)<ContainerProps>`
  position: absolute;
  ${({ theme, isChip, reversed }) =>
    reversed
      ? css`
          right: ${isChip ? `calc(100% + ${NODE_LINK_WIDTH}px)` : `${theme.components.block.width - NODE_LINK_WIDTH + 2}px`};
          flex-direction: row-reverse;
        `
      : css`
          left: ${isChip ? `calc(100% + ${NODE_LINK_WIDTH}px)` : `${theme.components.block.width - NODE_LINK_WIDTH + 2}px`};
        `};
`;

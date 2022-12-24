import { css, styled } from '@/hocs/styled';

import { NODE_LINK_WIDTH } from '../constants';

interface PortLink {
  isAction?: boolean;
  reversed?: boolean;
}

const PortLink = styled.svg<PortLink>`
  ${({ isAction, reversed }) =>
    reversed
      ? css`
          left: -${NODE_LINK_WIDTH + (isAction ? 0 : 1)}px;
        `
      : css`
          right: -${NODE_LINK_WIDTH + (isAction ? 0 : 1)}px;
        `};

  position: absolute;
  width: ${NODE_LINK_WIDTH}px;
  height: 4px;
`;

export default PortLink;

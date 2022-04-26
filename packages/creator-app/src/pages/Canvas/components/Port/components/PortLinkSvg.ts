import { css, styled } from '@/hocs';

import { NODE_LINK_WIDTH } from '../constants';

interface PortLink {
  reversed?: boolean;
}

const PortLink = styled.svg<PortLink>`
  ${({ reversed }) =>
    reversed
      ? css`
          left: -${NODE_LINK_WIDTH + 1}px;
        `
      : css`
          right: -${NODE_LINK_WIDTH + 1}px;
        `};

  position: absolute;
  width: ${NODE_LINK_WIDTH}px;
  height: 4px;
`;

export default PortLink;

import { css, styled } from '@/hocs';

import { LINK_WIDTH } from '../constants';

interface PortLink {
  reversed?: boolean;
}

const PortLink = styled.svg<PortLink>`
  ${({ reversed }) =>
    reversed
      ? css`
          left: -${LINK_WIDTH + 1}px;
        `
      : css`
          right: -${LINK_WIDTH + 1}px;
        `};

  position: absolute;
  width: ${LINK_WIDTH}px;
  height: 4px;
`;

export default PortLink;

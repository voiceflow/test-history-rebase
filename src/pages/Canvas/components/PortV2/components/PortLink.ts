import { styled } from '@/hocs';

import { LINK_WIDTH } from '../constants';

const PortLink = styled.svg`
  position: absolute;
  right: -${LINK_WIDTH}px;
  width: ${LINK_WIDTH}px;
  height: 4px;
`;

export default PortLink;

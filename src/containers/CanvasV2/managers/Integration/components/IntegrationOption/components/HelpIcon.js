import { Tooltip } from 'react-tippy';

import { styled } from '@/hocs';

const HelpIcon = styled(Tooltip)`
  position: absolute;
  top: 6px;
  right: 8px;
  color: grey;
  width: 25px;
  height: 25px;
`;

export default HelpIcon;

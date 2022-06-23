import { Box } from '@voiceflow/ui';
import { space, SpaceProps } from 'styled-system';

import { styled, units } from '@/hocs';

const ModalBody = styled(Box)<SpaceProps>`
  width: 100%;
  position: relative;
  padding: ${units(4)}px;
  padding-top: 0;
  ${space};
`;

export default ModalBody;

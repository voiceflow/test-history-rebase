import { Box } from '@voiceflow/ui';

import { styled, units } from '@/hocs';

const ModalBody = styled(Box)`
  width: 100%;
  position: relative;
  padding: 0 ${units(4)}px ${units(4)}px ${units(4)}px;
`;

export default ModalBody;

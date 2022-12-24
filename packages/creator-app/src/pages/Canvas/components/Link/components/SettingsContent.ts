import { Box, Popper } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';
import { FadeDown } from '@/styles/animations';

const SettingsContent = styled(Box.Flex)`
  ${FadeDown}
  ${Popper.baseStyles}

  overflow: hidden;
  background-color: #fff;
`;

export default SettingsContent;

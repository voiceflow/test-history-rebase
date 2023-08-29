import { Animations, Box, Popper } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const SettingsContent = styled(Box.Flex)`
  ${Animations.fadeInDownStyle}
  ${Popper.baseStyles}

  overflow: hidden;
  background-color: #fff;
`;

export default SettingsContent;

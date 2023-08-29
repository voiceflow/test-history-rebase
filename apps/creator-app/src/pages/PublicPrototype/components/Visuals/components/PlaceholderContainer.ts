import { Animations, Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const PlaceholderContainer = styled(Box.FlexCenter)`
  ${Animations.fadeInStyle}
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export default PlaceholderContainer;

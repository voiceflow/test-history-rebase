import { BoxFlexCenter } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';
import { Fade } from '@/styles/animations';

const PlaceholderContainer = styled(BoxFlexCenter)`
  ${Fade}
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export default PlaceholderContainer;

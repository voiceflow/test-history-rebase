import { Animations, Box } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const Container = styled(Box.FlexCenter)`
  flex: 1;
  overflow: hidden;
  overflow: clip;
  margin-right: 18px;

  > * {
    ${Animations.fadeInDownStyle}
  }
`;

export default Container;

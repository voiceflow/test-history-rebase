import { Animations } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const AnimatedContent = styled(Animations.Fade)`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: clip;
  overflow: hidden;
`;

export default AnimatedContent;

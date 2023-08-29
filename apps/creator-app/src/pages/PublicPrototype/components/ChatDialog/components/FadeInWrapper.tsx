import { Animations } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

const FadeUpWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  ${Animations.fadeInUpStyle}
`;

export default FadeUpWrapper;

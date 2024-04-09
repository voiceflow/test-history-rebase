import { Animations } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const Container = styled(Animations.FadeLeft)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const ContainerWithoutAnimation = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

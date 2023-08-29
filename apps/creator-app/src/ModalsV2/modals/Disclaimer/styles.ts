import { Animations, Box } from '@voiceflow/ui';

import { styled, transition } from '@/hocs/styled';

export const OuterContainer = styled.div`
  position: relative;
`;

export const Container = styled(Box)`
  ${transition('background')};
  position: absolulte;
  overflow-y: scroll;
  max-height: calc(100vh - 216.5px);
  padding: 20px 32px 32px;
  line-height: 22px;
  scroll-behavior: smooth;
`;

export const ButtonContainer = styled(Animations.FadeDown)`
  display: flex;
  justify-content: center;
  position: absolute;
  padding-bottom: 16px;
  bottom: 0px;
  width: 100%;
  font-size: 13px;
  background: linear-gradient(rgba(255, 255, 255, 0.3), white 100%) center bottom;
`;

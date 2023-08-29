import { Animations, Flex } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

interface ContainerProps {
  isPublic?: boolean;
}

export const Container = styled(Flex).attrs({ column: true })<ContainerProps>`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  position: relative;
  & > * {
    width: 100%;
  }

  ${({ isPublic }) =>
    isPublic &&
    css`
      max-height: 600px;
      max-width: 500px;
      margin: auto;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.15);
    `}
`;

export const IdleContainer = styled(Container)`
  @media (min-height: 730px) {
    overflow: hidden;
  }
`;

export const Drawer = styled(Animations.FadeRight)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export default Container;

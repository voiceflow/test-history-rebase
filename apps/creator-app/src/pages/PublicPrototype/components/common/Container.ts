import { BoxFlexApart } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

interface ContainerProps {
  isMobile?: boolean;
  isVisuals?: boolean;
}

const Container = styled(BoxFlexApart).attrs({ column: true })<ContainerProps>`
  width: 100%;
  height: 100%;
  padding: ${({ isMobile, isVisuals }) =>
    // eslint-disable-next-line no-nested-ternary
    isMobile ? '32px' : isVisuals ? 0 : '48px 48px 28px 48px'};
  background-color: ${({ isVisuals }) => (isVisuals ? 'white' : '#fdfdfd')};
`;

export default Container;

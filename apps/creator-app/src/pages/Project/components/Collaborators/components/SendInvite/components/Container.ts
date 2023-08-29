import { Animations } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export interface ContainerProps {
  error: boolean;
}

const Container = styled.div<ContainerProps>`
  ${Animations.fadeInLeftStyle}
  border-bottom: 1px solid #eaeff4;
  padding: 24px 32px 0 32px;
  padding-bottom: ${({ error }) => (error ? 0 : 16)}px;
`;

export default Container;

import { Box } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

interface ContainerProps {
  isMobile?: boolean;
}

const Container = styled(Box)<ContainerProps>`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;

  ${({ isMobile }) =>
    !isMobile &&
    css`
      align-items: center;
    `}
`;

export default Container;

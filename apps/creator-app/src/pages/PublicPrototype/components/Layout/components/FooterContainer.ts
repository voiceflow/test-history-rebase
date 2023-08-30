import { Box } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs/styled';

export const FOOTER_HEIGHT = 74;

interface FooterContainerProps {
  isHidden?: boolean;
}

const FooterContainer = styled(Box.FlexCenter)<FooterContainerProps>`
  ${transition('transform')};

  height: ${FOOTER_HEIGHT}px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  transform: translateY(0);

  ${({ isHidden }) =>
    isHidden &&
    css`
      transform: translateY(${FOOTER_HEIGHT}px);
    `}
`;

export default FooterContainer;

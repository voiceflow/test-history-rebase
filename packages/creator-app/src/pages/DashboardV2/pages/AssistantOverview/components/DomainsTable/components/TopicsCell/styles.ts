import { ClickableText } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

const hoverStyles = css`
  text-decoration: underline;
`;

export const Link = styled(ClickableText)<{ isOpen?: boolean }>`
  &:hover {
    ${hoverStyles}
  }

  ${({ isOpen }) => isOpen && hoverStyles}
`;

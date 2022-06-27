import { Button, Resizable } from '@voiceflow/ui';

import { css, styled, transition } from '@/hocs';

export const CollapseButton = styled(Button).attrs({ variant: Button.Variant.WHITE, iconProps: { size: 12 } })<{ isOpen: boolean }>`
  ${transition('opacity')}
  opacity: ${({ isOpen }) => (isOpen ? 0 : 1)};
  position: absolute;
  left: ${({ isOpen, theme }) => (isOpen ? `-12px` : `${theme.components.sidebarIconMenu.width - 12}px`)};
  top: 50%;
  margin-top: ${({ isOpen, theme }) => (isOpen ? `-12px` : `${theme.components.header.height / 2 - 12}px`)};
  width: 24px;
  height: 24px;
  padding: 0;
  font-size: 16px;
  border-radius: 50%;
  z-index: 30;
  ${({ isOpen }) =>
    !isOpen &&
    css`
      animation: fadein 1.1s ease both;
    `}
`;

export const Container = styled(Resizable.VerticalHandle)`
  z-index: 100;
  &:hover ${CollapseButton} {
    opacity: 1;
  }
`;

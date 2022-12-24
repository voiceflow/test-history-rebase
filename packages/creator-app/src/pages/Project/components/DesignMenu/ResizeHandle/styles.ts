import { Button, Resizable, SvgIcon } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';

export const CollapseButton = styled(Button).attrs({ variant: Button.Variant.WHITE, iconProps: { size: 16 }, tiny: true })<{ isOpen: boolean }>`
  opacity: ${({ isOpen }) => (isOpen ? 0 : 1)};
  left: ${({ isOpen, theme }) => (isOpen ? `-12px` : `${theme.components.sidebarIconMenu.width - 12}px`)};
  top: 50%;
  margin-top: ${({ isOpen, theme }) => (isOpen ? `-12px` : `${theme.components.header.height / 2 - 12}px`)};

  ${({ isOpen }) =>
    !isOpen &&
    css`
      animation: fadein 1.1s ease both;
    `}

  ${SvgIcon.Container} {
    transform: ${({ isOpen }) => (isOpen ? 'rotate(0)' : 'rotate(180deg)')};
  }
`;

export const Container = styled(Resizable.VerticalHandle)`
  z-index: 100;
  &:hover ${CollapseButton} {
    opacity: 1;
  }
`;

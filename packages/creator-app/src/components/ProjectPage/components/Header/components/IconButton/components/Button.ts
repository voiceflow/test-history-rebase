import { BaseIconButtonProps, IconButton, IconButtonOutlineContainerProps, IconButtonVariant } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

export interface ButtonProps extends BaseIconButtonProps, IconButtonOutlineContainerProps {
  isSmall?: boolean;
  withBadge?: boolean;
}

const SMALL_BUTTON_SIZE = 42;

const Button = styled(IconButton).attrs({ variant: IconButtonVariant.OUTLINE, preventFocusStyle: true })<ButtonProps>`
  width: ${({ theme, isSmall }) => (isSmall ? SMALL_BUTTON_SIZE : theme.components.projectPage.header.height)}px;
  height: ${({ isSmall }) => (isSmall ? `${SMALL_BUTTON_SIZE}px` : '100%')};
  border: none !important;
  border-radius: ${({ isSmall }) => (isSmall ? 5 : 0)}px;

  ${({ onClick }) =>
    !onClick &&
    css`
      pointer-events: none;
    `}

  ${({ withBadge }) =>
    withBadge &&
    css`
      position: relative;

      &:after {
        position: absolute;
        top: 50%;
        right: 50%;
        display: block;
        width: 6px;
        height: 6px;
        margin-top: -9px;
        margin-right: -10px;
        border: solid 1px #fff;
        border-radius: 6px;
        background-image: linear-gradient(to bottom, rgba(224, 79, 120, 0.85), #e04f78 99%);
        content: '';
      }
    `}
`;

export default Button;

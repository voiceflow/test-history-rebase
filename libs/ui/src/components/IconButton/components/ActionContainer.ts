import type { IconButtonVariant } from '@ui/components/IconButton/types';
import { colors, css, styled, ThemeColor } from '@ui/styles';

import type { IconButtonContainerSharedProps } from './IconButtonContainer';
import IconButtonContainer, { importantStyles } from './IconButtonContainer';

export interface ActionContainerProps extends IconButtonContainerSharedProps {
  variant: IconButtonVariant.ACTION;
}

export const beforeStyles = css`
  &::before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    background: linear-gradient(180deg, rgba(93, 157, 245, 0.04) 0%, rgba(44, 133, 255, 0.12) 100%);
    border-radius: 50%;
    opacity: 0;
    transition:
      opacity 0.12s linear,
      -webkit-box-shadow 0.12s linear;
    content: '';
  }

  &:active::before {
    box-shadow: inset 0 0 0 1px ${colors(ThemeColor.WHITE)};
    opacity: 1;
  }
`;

const ActionContainer = styled(IconButtonContainer)<ActionContainerProps>`
  ${importantStyles}
  ${beforeStyles}
  color: ${colors(ThemeColor.BLUE)};
  border: 1px solid ${colors(ThemeColor.WHITE)};
  box-shadow:
    0 0 0 1px ${colors(ThemeColor.WHITE)},
    0 1px 2px 1px rgba(17, 49, 96, 0.16);

  &:hover {
    color: ${colors(ThemeColor.BLUE)};
    box-shadow:
      0 0 0 1px ${colors(ThemeColor.WHITE)},
      0 2px 4px 1px rgba(17, 49, 96, 0.16);
  }

  ${({ disabled }) =>
    disabled &&
    css`
      box-shadow: 0 1px 2px rgba(17, 49, 96, 0.16);
    `};
`;

export default ActionContainer;
